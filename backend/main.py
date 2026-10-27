from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from database import get_connection
from ai.gemini import ask_supplychain_agent
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SupplyChain AI API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "supplychain-api",
    }
# -------------------------
# Pydantic Model
# -------------------------

class ProductCreate(BaseModel):
    name: str
    sku: str
    category: str | None = None
    unit: str = "unit"

class SupplierCreate(BaseModel):
    name: str
    email: str | None = None
    phone: str | None = None
    address: str | None = None

class InventoryCreate(BaseModel):
    product_id: int = Field(gt=0)
    current_stock: float = Field(ge=0)
    reorder_level: float = Field(ge=0)
    daily_usage: float = Field(ge=0)


class PurchaseOrderItemCreate(BaseModel):
    product_id: int = Field(gt=0)
    quantity: float = Field(gt=0)


class PurchaseOrderCreate(BaseModel):
    supplier_id: int
    items: list[PurchaseOrderItemCreate]

def calculate_reorder_quantity(
    current_stock,
    daily_usage,
    target_days=14
):
    target_stock = daily_usage * target_days

    reorder_quantity = target_stock - current_stock

    if reorder_quantity < 0:
        reorder_quantity = 0

    return round(reorder_quantity, 2)

def get_stock_risk(days_remaining):

    if days_remaining is None:
        return "UNKNOWN"

    if days_remaining < 3:
        return "CRITICAL"

    if days_remaining < 7:
        return "HIGH"

    if days_remaining <= 14:
        return "MEDIUM"

    return "LOW"

# -------------------------
# Database Test
# -------------------------

@app.get("/db-test")
def database_test():

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT NOW();")
            result = cursor.fetchone()

        return {
            "database": "connected",
            "time": result[0]
        }

    finally:
        connection.close()


# -------------------------
# GET ALL PRODUCTS
# -------------------------

@app.get("/products")
def get_products():

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    id,
                    name,
                    sku,
                    category,
                    unit
                FROM products
                ORDER BY id;
            """)

            rows = cursor.fetchall()

            products = []

            for row in rows:
                products.append({
                    "id": row[0],
                    "name": row[1],
                    "sku": row[2],
                    "category": row[3],
                    "unit": row[4]
                })

            return products

    finally:
        connection.close()


# -------------------------
# GET ONE PRODUCT
# -------------------------

@app.get("/products/{product_id}")
def get_product(product_id: int):

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    id,
                    name,
                    sku,
                    category,
                    unit
                FROM products
                WHERE id = %s;
            """, (product_id,))

            row = cursor.fetchone()

            if row is None:
                raise HTTPException(
                    status_code=404,
                    detail="Product not found"
                )

            return {
                "id": row[0],
                "name": row[1],
                "sku": row[2],
                "category": row[3],
                "unit": row[4]
            }

    finally:
        connection.close()


# -------------------------
# CREATE PRODUCT
# -------------------------

@app.post("/products", status_code=201)
def create_product(product: ProductCreate):

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute("""
                INSERT INTO products
                    (name, sku, category, unit)
                VALUES
                    (%s, %s, %s, %s)
                RETURNING id;
            """, (
                product.name,
                product.sku,
                product.category,
                product.unit
            ))

            product_id = cursor.fetchone()[0]

            connection.commit()

            return {
                "message": "Product created successfully",
                "product_id": product_id
            }

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    finally:
        connection.close()


# -------------------------
# UPDATE PRODUCT
# -------------------------

@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    product: ProductCreate
):

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute("""
                UPDATE products
                SET
                    name = %s,
                    sku = %s,
                    category = %s,
                    unit = %s
                WHERE id = %s
                RETURNING id;
            """, (
                product.name,
                product.sku,
                product.category,
                product.unit,
                product_id
            ))

            row = cursor.fetchone()

            if row is None:
                raise HTTPException(
                    status_code=404,
                    detail="Product not found"
                )

            connection.commit()

            return {
                "message": "Product updated successfully",
                "product_id": product_id
            }

    except HTTPException:
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    finally:
        connection.close()


# -------------------------
# DELETE PRODUCT
# -------------------------

@app.delete("/products/{product_id}")
def delete_product(product_id: int):

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute("""
                DELETE FROM products
                WHERE id = %s
                RETURNING id;
            """, (product_id,))

            row = cursor.fetchone()

            if row is None:
                raise HTTPException(
                    status_code=404,
                    detail="Product not found"
                )

            connection.commit()

            return {
                "message": "Product deleted successfully",
                "product_id": product_id
            }

    except HTTPException:
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    finally:
        connection.close()

@app.get("/suppliers")
def get_suppliers():
    connection=get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute("""
            
                SELECT
                    id,
                    name,
                    email,
                    phone,
                    address
                FROM suppliers
                ORDER BY id;
            """)

            rows = cursor.fetchall()

            suppliers = []

            for row in rows:
                suppliers.append({
                    "id": row[0],
                    "name": row[1],
                    "email": row[2],
                    "phone": row[3],
                    "address": row[4]
                })

            return suppliers

    finally:
        connection.close()

@app.get("/suppliers/{supplier_id}")
def get_supplier(supplier_id: int):

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    id,
                    name,
                    email,
                    phone,
                    address
                FROM suppliers
                WHERE id = %s;
            """, (supplier_id,))

            row = cursor.fetchone()

            if row is None:
                raise HTTPException(
                    status_code=404,
                    detail="Supplier not found"
                )

            return {
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "phone": row[3],
                "address": row[4]
            }

    finally:
        connection.close()

@app.post("/suppliers", status_code=201)
def create_supplier(supplier: SupplierCreate):

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute("""
                INSERT INTO suppliers
                    (name, email, phone, address)
                VALUES
                    (%s, %s, %s, %s)
                RETURNING id;
            """, (
                supplier.name,
                supplier.email,
                supplier.phone,
                supplier.address
            ))

            supplier_id = cursor.fetchone()[0]

            connection.commit()

            return {
                "message": "Supplier created successfully",
                "supplier_id": supplier_id
            }

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    finally:
        connection.close()

@app.put("/suppliers/{supplier_id}")
def update_supplier(
    supplier_id: int,
    supplier: SupplierCreate
):

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute("""
                UPDATE suppliers
                SET
                    name = %s,
                    email = %s,
                    phone = %s,
                    address = %s
                WHERE id = %s
                RETURNING id;
            """, (
                supplier.name,
                supplier.email,
                supplier.phone,
                supplier.address,
                supplier_id
            ))

            row = cursor.fetchone()

            if row is None:
                raise HTTPException(
                    status_code=404,
                    detail="Supplier not found"
                )

            connection.commit()

            return {
                "message": "Supplier updated successfully",
                "supplier_id": supplier_id
            }

    except HTTPException:
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    finally:
        connection.close()

@app.delete("/suppliers/{supplier_id}")
def delete_supplier(supplier_id: int):

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute("""
                DELETE FROM suppliers
                WHERE id = %s
                RETURNING id;
            """, (supplier_id,))

            row = cursor.fetchone()

            if row is None:
                raise HTTPException(
                    status_code=404,
                    detail="Supplier not found"
                )

            connection.commit()

            return {
                "message": "Supplier deleted successfully",
                "supplier_id": supplier_id
            }

    except HTTPException:
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    finally:
        connection.close()

@app.get("/products/{product_id}/suppliers")
def get_product_suppliers(product_id: int):

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    s.id,
                    s.name,
                    s.email,
                    s.phone,
                    sp.price,
                    sp.lead_time_days,
                    sp.minimum_order_quantity
                FROM supplier_products sp

                JOIN suppliers s
                    ON sp.supplier_id = s.id

                WHERE sp.product_id = %s

                ORDER BY sp.price ASC;
            """, (product_id,))

            rows = cursor.fetchall()

            suppliers = []

            for row in rows:
                suppliers.append({
                    "supplier_id": row[0],
                    "supplier_name": row[1],
                    "email": row[2],
                    "phone": row[3],
                    "price": float(row[4]),
                    "lead_time_days": row[5],
                    "minimum_order_quantity": float(row[6])
                })

            return suppliers

    finally:
        connection.close()

@app.get("/inventory")
def get_inventory():

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    i.id,
                    p.id,
                    p.name,
                    p.sku,
                    p.category,
                    p.unit,
                    i.current_stock,
                    i.reorder_level,
                    i.daily_usage,
                    i.updated_at
                FROM inventory i
                JOIN products p
                    ON i.product_id = p.id
                ORDER BY i.id;
            """)

            rows = cursor.fetchall()

            inventory = []

            for row in rows:

                current_stock = float(row[6])
                daily_usage = float(row[8])

                days_remaining = None

                if daily_usage > 0:
                    days_remaining = round(
                        current_stock / daily_usage,
                        2
                    )
                risk = get_stock_risk(days_remaining)
                

                inventory.append({
                    "id": row[0],
                    "product_id": row[1],
                    "product_name": row[2],
                    "sku": row[3],
                    "category": row[4],
                    "unit": row[5],
                    "current_stock": current_stock,
                    "reorder_level": float(row[7]),
                    "daily_usage": daily_usage,
                    "days_remaining": days_remaining,
                    "updated_at": row[9]
                })

            return inventory

    finally:
        connection.close()


@app.get("/inventory/{product_id}")
def get_product_inventory(product_id: int):

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    i.id,
                    p.id,
                    p.name,
                    p.sku,
                    p.category,
                    p.unit,
                    i.current_stock,
                    i.reorder_level,
                    i.daily_usage,
                    i.updated_at
                FROM inventory i
                JOIN products p
                    ON i.product_id = p.id
                WHERE i.product_id = %s;
            """, (product_id,))

            row = cursor.fetchone()

            if row is None:
                raise HTTPException(
                    status_code=404,
                    detail="Inventory record not found"
                )

            current_stock = float(row[6])
            daily_usage = float(row[8])

            days_remaining = None

            if daily_usage > 0:
                days_remaining = round(
                    current_stock / daily_usage,
                    2
                )

            return {
                "id": row[0],
                "product_id": row[1],
                "product_name": row[2],
                "sku": row[3],
                "category": row[4],
                "unit": row[5],
                "current_stock": current_stock,
                "reorder_level": float(row[7]),
                "daily_usage": daily_usage,
                "days_remaining": days_remaining,
                "updated_at": row[9]
            }

    finally:
        connection.close()


@app.post("/inventory", status_code=201)
def create_inventory(inventory: InventoryCreate):

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute("""
                INSERT INTO inventory
                (
                    product_id,
                    current_stock,
                    reorder_level,
                    daily_usage
                )
                VALUES
                (%s, %s, %s, %s)
                RETURNING id;
            """, (
                inventory.product_id,
                inventory.current_stock,
                inventory.reorder_level,
                inventory.daily_usage
            ))

            inventory_id = cursor.fetchone()[0]

            connection.commit()

            return {
                "message": "Inventory record created successfully",
                "inventory_id": inventory_id
            }

    except Exception as error:

        connection.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    finally:
        connection.close()

@app.put("/inventory/{product_id}")
def update_inventory(
    product_id: int,
    inventory: InventoryCreate
):

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute("""
                UPDATE inventory
                SET
                    current_stock = %s,
                    reorder_level = %s,
                    daily_usage = %s,
                    updated_at = CURRENT_TIMESTAMP
                WHERE product_id = %s
                RETURNING id;
            """, (
                inventory.current_stock,
                inventory.reorder_level,
                inventory.daily_usage,
                product_id
            ))

            row = cursor.fetchone()

            if row is None:

                raise HTTPException(
                    status_code=404,
                    detail="Inventory record not found"
                )

            connection.commit()

            return {
                "message": "Inventory updated successfully",
                "inventory_id": row[0]
            }

    except HTTPException:
        raise

    except Exception as error:

        connection.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    finally:
        connection.close()


@app.get("/inventory/low-stock")
def get_low_stock_inventory():

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    p.id,
                    p.name,
                    p.sku,
                    p.unit,
                    i.current_stock,
                    i.reorder_level,
                    i.daily_usage
                FROM inventory i

                JOIN products p
                    ON i.product_id = p.id

                WHERE i.current_stock <= i.reorder_level

                ORDER BY i.current_stock ASC;
            """)

            rows = cursor.fetchall()

            result = []

            for row in rows:

                current_stock = float(row[4])
                daily_usage = float(row[6])

                days_remaining = None

                if daily_usage > 0:
                    days_remaining = round(
                        current_stock / daily_usage,
                        2
                    )

                result.append({
                    "product_id": row[0],
                    "product_name": row[1],
                    "sku": row[2],
                    "unit": row[3],
                    "current_stock": current_stock,
                    "reorder_level": float(row[5]),
                    "daily_usage": daily_usage,
                    "days_remaining": days_remaining
                })

            return result

    finally:
        connection.close()

@app.get("/procurement/recommendations")
def get_procurement_recommendations():

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    p.id,
                    p.name,
                    p.sku,
                    p.unit,
                    i.current_stock,
                    i.reorder_level,
                    i.daily_usage
                FROM inventory i

                JOIN products p
                    ON i.product_id = p.id

                WHERE i.current_stock <= i.reorder_level

                ORDER BY i.current_stock ASC;
            """)

            inventory_rows = cursor.fetchall()

            recommendations = []

            for row in inventory_rows:

                product_id = row[0]
                product_name = row[1]
                sku = row[2]
                unit = row[3]

                current_stock = float(row[4])
                reorder_level = float(row[5])
                daily_usage = float(row[6])

                days_remaining = None

                if daily_usage > 0:
                    days_remaining = round(
                        current_stock / daily_usage,
                        2
                    )

                reorder_quantity = calculate_reorder_quantity(
                    current_stock,
                    daily_usage
                )

                recommendations.append({
                    "product_id": product_id,
                    "product_name": product_name,
                    "sku": sku,
                    "unit": unit,
                    "current_stock": current_stock,
                    "reorder_level": reorder_level,
                    "daily_usage": daily_usage,
                    "days_remaining": days_remaining,
                    "reorder_quantity": reorder_quantity
                })

            return recommendations

    finally:
        connection.close()

@app.get("/procurement/recommendations/{product_id}")
def get_product_procurement_recommendation(product_id: int):

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            # -------------------------
            # Get inventory
            # -------------------------

            cursor.execute("""
                SELECT
                    p.name,
                    p.sku,
                    p.unit,
                    i.current_stock,
                    i.reorder_level,
                    i.daily_usage
                FROM inventory i
                JOIN products p
                    ON i.product_id = p.id
                WHERE p.id = %s;
            """, (product_id,))

            inventory = cursor.fetchone()

            if inventory is None:
                raise HTTPException(
                    status_code=404,
                    detail="Product inventory not found"
                )

            product_name = inventory[0]
            sku = inventory[1]
            unit = inventory[2]
            current_stock = float(inventory[3])
            reorder_level = float(inventory[4])
            daily_usage = float(inventory[5])

            # -------------------------
            # Calculate requirement
            # -------------------------

            days_remaining = None

            if daily_usage > 0:
                days_remaining = round(
                    current_stock / daily_usage,
                    2
                )

            reorder_quantity = calculate_reorder_quantity(
                current_stock,
                daily_usage
            )

            # -------------------------
            # Get suppliers
            # -------------------------

            cursor.execute("""
                SELECT
                    s.id,
                    s.name,
                    sp.price,
                    sp.lead_time_days,
                    sp.minimum_order_quantity
                FROM supplier_products sp

                JOIN suppliers s
                    ON sp.supplier_id = s.id

                WHERE sp.product_id = %s

                ORDER BY sp.price ASC;
            """, (product_id,))

            supplier_rows = cursor.fetchall()

            suppliers = []

            for row in supplier_rows:

                suppliers.append({
                    "supplier_id": row[0],
                    "supplier_name": row[1],
                    "price": float(row[2]),
                    "lead_time_days": row[3],
                    "minimum_order_quantity": float(row[4])
                })

            return {
                "product": {
                    "id": product_id,
                    "name": product_name,
                    "sku": sku,
                    "unit": unit
                },
                "inventory": {
                    "current_stock": current_stock,
                    "reorder_level": reorder_level,
                    "daily_usage": daily_usage,
                    "days_remaining": days_remaining,
                    "reorder_quantity": reorder_quantity
                },
                "suppliers": suppliers
            }

    finally:
        connection.close()

@app.post("/purchase-orders", status_code=201)
def create_purchase_order(order: PurchaseOrderCreate):

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            total_amount = 0
            items_to_insert = []

            # -------------------------
            # Validate supplier
            # -------------------------

            cursor.execute("""
                SELECT id
                FROM suppliers
                WHERE id = %s;
            """, (order.supplier_id,))

            supplier = cursor.fetchone()

            if supplier is None:
                raise HTTPException(
                    status_code=404,
                    detail="Supplier not found"
                )

            # -------------------------
            # Validate each product
            # -------------------------

            for item in order.items:

                cursor.execute("""
                    SELECT price
                    FROM supplier_products
                    WHERE supplier_id = %s
                    AND product_id = %s;
                """, (
                    order.supplier_id,
                    item.product_id
                ))

                supplier_product = cursor.fetchone()

                if supplier_product is None:
                    raise HTTPException(
                        status_code=400,
                        detail=(
                            f"Supplier {order.supplier_id} "
                            f"does not supply product {item.product_id}"
                        )
                    )

                unit_price = float(supplier_product[0])

                item_total = unit_price * item.quantity

                total_amount += item_total

                items_to_insert.append({
                    "product_id": item.product_id,
                    "quantity": item.quantity,
                    "unit_price": unit_price
                })

            # -------------------------
            # Create purchase order
            # -------------------------

            cursor.execute("""
                INSERT INTO purchase_orders
                (
                    supplier_id,
                    status,
                    total_amount
                )
                VALUES
                (%s, %s, %s)
                RETURNING id;
            """, (
                order.supplier_id,
                "PENDING_APPROVAL",
                total_amount
            ))

            purchase_order_id = cursor.fetchone()[0]

            # -------------------------
            # Add order items
            # -------------------------

            for item in items_to_insert:

                cursor.execute("""
                    INSERT INTO purchase_order_items
                    (
                        purchase_order_id,
                        product_id,
                        quantity,
                        unit_price
                    )
                    VALUES
                    (%s, %s, %s, %s);
                """, (
                    purchase_order_id,
                    item["product_id"],
                    item["quantity"],
                    item["unit_price"]
                ))

            connection.commit()

            return {
                "message": "Purchase order created successfully",
                "purchase_order_id": purchase_order_id,
                "status": "PENDING_APPROVAL",
                "total_amount": round(total_amount, 2)
            }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:

        connection.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    finally:
        connection.close()


@app.get("/purchase-orders")
def get_purchase_orders():

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    po.id,
                    s.name,
                    po.status,
                    po.total_amount,
                    po.created_at
                FROM purchase_orders po
                JOIN suppliers s
                    ON po.supplier_id = s.id
                ORDER BY po.created_at DESC;
            """)

            rows = cursor.fetchall()

            orders = []

            for row in rows:

                orders.append({
                    "id": row[0],
                    "supplier_name": row[1],
                    "status": row[2],
                    "total_amount": float(row[3]),
                    "created_at": row[4]
                })

            return orders

    finally:
        connection.close()

@app.get("/purchase-orders/{purchase_order_id}")
def get_purchase_order(purchase_order_id: int):

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    po.id,
                    s.id,
                    s.name,
                    po.status,
                    po.total_amount,
                    po.created_at
                FROM purchase_orders po
                JOIN suppliers s
                    ON po.supplier_id = s.id
                WHERE po.id = %s;
            """, (purchase_order_id,))

            order = cursor.fetchone()

            if order is None:
                raise HTTPException(
                    status_code=404,
                    detail="Purchase order not found"
                )

            cursor.execute("""
                SELECT
                    p.id,
                    p.name,
                    p.sku,
                    poi.quantity,
                    poi.unit_price
                FROM purchase_order_items poi
                JOIN products p
                    ON poi.product_id = p.id
                WHERE poi.purchase_order_id = %s;
            """, (purchase_order_id,))

            item_rows = cursor.fetchall()

            items = []

            for row in item_rows:

                items.append({
                    "product_id": row[0],
                    "product_name": row[1],
                    "sku": row[2],
                    "quantity": float(row[3]),
                    "unit_price": float(row[4]),
                    "total": round(
                        float(row[3]) * float(row[4]),
                        2
                    )
                })

            return {
                "id": order[0],
                "supplier_id": order[1],
                "supplier_name": order[2],
                "status": order[3],
                "total_amount": float(order[4]),
                "created_at": order[5],
                "items": items
            }

    finally:
        connection.close()




@app.get("/ai/ask")
def ask_ai(message: str):

    result = ask_supplychain_agent(message)

    return result