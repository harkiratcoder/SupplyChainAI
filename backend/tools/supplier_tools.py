from database import get_connection


def get_product_suppliers(product_id: int):
    """
    Return suppliers that provide a specific product,
    including price, lead time and minimum order quantity.
    """

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