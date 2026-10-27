from database import get_connection


def get_low_stock_inventory():
    """
    Return products that are currently at or below
    their reorder level.
    """

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