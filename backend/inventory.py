# inventory = [
#     {
#         "name": "Rice",
#         "stock": 120,
#         "daily_usage": 35
#     },
#     {
#         "name": "Oil",
#         "stock": 20,
#         "daily_usage": 8
#     }
# ]


# def show_inventory():
#     for product in inventory:
#         print(product["name"], "-", product["stock"], "kg")


# if __name__ == "__main__":
#     show_inventory()


products = [
    {
        "name": "Rice",
        "stock": 120
    },
    {
        "name": "Oil",
        "stock": 20
    },
    {
        "name": "Sugar",
        "stock": 80
    }
]

suppliers = [
    {
        "name": "ABC Foods",
        "price": 52,
        "lead_time": 3
    },
    {
        "name": "XYZ Traders",
        "price": 49,
        "lead_time": 7
    },
    {
        "name": "PQR Supplies",
        "price": 51,
        "lead_time": 5
    }
]


def compare_suppliers():

    for product in products:

        print("\nProduct:", product["name"])

        for supplier in suppliers:

            print(
                supplier["name"],
                "| Price: ₹", supplier["price"],
                "| Delivery:", supplier["lead_time"], "days"
            )


if __name__ == "__main__":
    compare_suppliers()