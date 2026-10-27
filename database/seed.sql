INSERT INTO products (name, sku, category, unit)
VALUES
('Rice', 'RIC-001', 'Food', 'kg'),
('Cooking Oil', 'OIL-001', 'Food', 'litre'),
('Sugar', 'SUG-001', 'Food', 'kg'),
('Hand Soap', 'SOAP-001', 'Cleaning', 'unit'),
('Orange Juice', 'JUC-001', 'Beverage', 'litre');


INSERT INTO suppliers (name, email, phone, address)
VALUES
('ABC Foods', 'abc@example.com', '9876543210', 'Delhi'),
('XYZ Traders', 'xyz@example.com', '9876543211', 'Mumbai'),
('PQR Supplies', 'pqr@example.com', '9876543212', 'Bangalore');


INSERT INTO inventory
(product_id, current_stock, reorder_level, daily_usage)
VALUES
(1, 120, 100, 35),
(2, 450, 200, 20),
(3, 80, 100, 15),
(4, 320, 150, 5),
(5, 60, 100, 12);