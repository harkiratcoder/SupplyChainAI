import type { Product, Supplier, InventoryItem, ProcurementRecommendation, PurchaseOrder, ChatMessage } from '../types';

export const initialProducts: Product[] = [
  { id: 1, name: 'Premium Basmati Rice', sku: 'RIC-001', category: 'Food & Grains', unit: 'kg', description: 'Long grain aged basmati rice for wholesale food processing' },
  { id: 2, name: 'Pure Refined Cooking Oil', sku: 'OIL-001', category: 'Food & Grains', unit: 'litre', description: 'Grade A sunflower cooking oil for high-volume kitchen prep' },
  { id: 3, name: 'Refined White Sugar', sku: 'SUG-001', category: 'Food & Grains', unit: 'kg', description: 'Food-grade refined granulated cane sugar' },
  { id: 4, name: 'Antimicrobial Hand Soap', sku: 'SOAP-001', category: 'Sanitation', unit: 'unit', description: 'Institutional sanitizing foaming hand wash dispenser refill' },
  { id: 5, name: 'Organic Cold-Pressed Orange Juice', sku: 'JUC-001', category: 'Beverage', unit: 'litre', description: '100% pure fresh Valencia orange juice with 14-day refrigerated shelf life' },
  { id: 6, name: 'Heavy-Duty Corrugated Cartons', sku: 'PKG-101', category: 'Packaging', unit: 'unit', description: 'Double-wall shipping boxes 400x300x300mm' },
  { id: 7, name: 'Powder-Free Nitrile Gloves (L)', sku: 'PPE-202', category: 'Sanitation', unit: 'box', description: '4 mil chemical-resistant examination & handling gloves (100/box)' },
  { id: 8, name: 'Food-Grade Nitrogen Canisters', sku: 'GAS-004', category: 'Industrial Gas', unit: 'cylinder', description: '99.99% purity modified atmosphere packaging gas' },
];

export const initialSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'ABC Foods Ltd.',
    email: 'procurement@abcfoods.com',
    phone: '+1 (555) 234-5678',
    address: '450 Agro Logistics Park, Hub-A, Delhi NCR',
    rating: 4.8,
    leadTimeAvgDays: 3,
    onTimeDeliveryRate: 98.2,
    status: 'PREFERRED',
    paymentTerms: 'Net 30',
    productsSupplied: [
      { product_id: 1, product_name: 'Premium Basmati Rice', sku: 'RIC-001', price: 62.50, lead_time_days: 3, moq: 100 },
      { product_id: 3, product_name: 'Refined White Sugar', sku: 'SUG-001', price: 44.00, lead_time_days: 2, moq: 50 },
      { product_id: 5, product_name: 'Organic Cold-Pressed Orange Juice', sku: 'JUC-001', price: 85.00, lead_time_days: 2, moq: 40 },
    ],
  },
  {
    id: 2,
    name: 'XYZ Global Traders',
    email: 'orders@xyztraders.com',
    phone: '+1 (555) 345-6789',
    address: '12 Harbor Point Terminal, Sector 4, Mumbai',
    rating: 4.6,
    leadTimeAvgDays: 4,
    onTimeDeliveryRate: 94.7,
    status: 'ACTIVE',
    paymentTerms: 'Net 45',
    productsSupplied: [
      { product_id: 1, product_name: 'Premium Basmati Rice', sku: 'RIC-001', price: 65.00, lead_time_days: 4, moq: 80 },
      { product_id: 2, product_name: 'Pure Refined Cooking Oil', sku: 'OIL-001', price: 110.00, lead_time_days: 3, moq: 150 },
      { product_id: 3, product_name: 'Refined White Sugar', sku: 'SUG-001', price: 42.80, lead_time_days: 4, moq: 100 },
    ],
  },
  {
    id: 3,
    name: 'PQR Industrial Supplies',
    email: 'sales@pqrsupplies.com',
    phone: '+1 (555) 456-7890',
    address: '88 Tech Boulevard, Electronic City, Bangalore',
    rating: 4.9,
    leadTimeAvgDays: 2,
    onTimeDeliveryRate: 99.1,
    status: 'PREFERRED',
    paymentTerms: 'Net 30',
    productsSupplied: [
      { product_id: 4, product_name: 'Antimicrobial Hand Soap', sku: 'SOAP-001', price: 18.50, lead_time_days: 2, moq: 50 },
      { product_id: 7, product_name: 'Powder-Free Nitrile Gloves (L)', sku: 'PPE-202', price: 12.00, lead_time_days: 2, moq: 30 },
      { product_id: 8, product_name: 'Food-Grade Nitrogen Canisters', sku: 'GAS-004', price: 240.00, lead_time_days: 3, moq: 10 },
    ],
  },
  {
    id: 4,
    name: 'Apex Packaging Solutions',
    email: 'accounts@apexpack.io',
    phone: '+1 (555) 567-8901',
    address: '300 Container Way, Logistic Zone, Hyderabad',
    rating: 4.7,
    leadTimeAvgDays: 5,
    onTimeDeliveryRate: 96.0,
    status: 'ACTIVE',
    paymentTerms: 'Net 60',
    productsSupplied: [
      { product_id: 6, product_name: 'Heavy-Duty Corrugated Cartons', sku: 'PKG-101', price: 3.40, lead_time_days: 5, moq: 500 },
      { product_id: 4, product_name: 'Antimicrobial Hand Soap', sku: 'SOAP-001', price: 21.00, lead_time_days: 4, moq: 100 },
    ],
  }
];

export const initialInventory: InventoryItem[] = [
  {
    id: 1,
    product_id: 1,
    product_name: 'Premium Basmati Rice',
    sku: 'RIC-001',
    category: 'Food & Grains',
    unit: 'kg',
    current_stock: 120,
    reorder_level: 100,
    daily_usage: 35,
    days_remaining: 3.43,
    risk: 'HIGH',
    updated_at: '2026-09-17 18:30:00',
    location: 'Warehouse Alpha - Bay 4B',
  },
  {
    id: 2,
    product_id: 2,
    product_name: 'Pure Refined Cooking Oil',
    sku: 'OIL-001',
    category: 'Food & Grains',
    unit: 'litre',
    current_stock: 450,
    reorder_level: 200,
    daily_usage: 20,
    days_remaining: 22.5,
    risk: 'LOW',
    updated_at: '2026-09-17 18:30:00',
    location: 'Warehouse Alpha - Bay 2A',
  },
  {
    id: 3,
    product_id: 3,
    product_name: 'Refined White Sugar',
    sku: 'SUG-001',
    category: 'Food & Grains',
    unit: 'kg',
    current_stock: 80,
    reorder_level: 100,
    daily_usage: 15,
    days_remaining: 5.33,
    risk: 'HIGH',
    updated_at: '2026-09-17 18:30:00',
    location: 'Warehouse Alpha - Bay 4C',
  },
  {
    id: 4,
    product_id: 4,
    product_name: 'Antimicrobial Hand Soap',
    sku: 'SOAP-001',
    category: 'Sanitation',
    unit: 'unit',
    current_stock: 320,
    reorder_level: 150,
    daily_usage: 5,
    days_remaining: 64.0,
    risk: 'LOW',
    updated_at: '2026-09-17 18:30:00',
    location: 'Warehouse Beta - Shelf S1',
  },
  {
    id: 5,
    product_id: 5,
    product_name: 'Organic Cold-Pressed Orange Juice',
    sku: 'JUC-001',
    category: 'Beverage',
    unit: 'litre',
    current_stock: 32,
    reorder_level: 100,
    daily_usage: 12,
    days_remaining: 2.67,
    risk: 'CRITICAL',
    updated_at: '2026-09-17 18:30:00',
    location: 'Chilled Vault C - Rack 1',
  },
  {
    id: 6,
    product_id: 6,
    product_name: 'Heavy-Duty Corrugated Cartons',
    sku: 'PKG-101',
    category: 'Packaging',
    unit: 'unit',
    current_stock: 380,
    reorder_level: 500,
    daily_usage: 45,
    days_remaining: 8.44,
    risk: 'MEDIUM',
    updated_at: '2026-09-17 17:00:00',
    location: 'Warehouse Alpha - Packaging Floor',
  },
  {
    id: 7,
    product_id: 7,
    product_name: 'Powder-Free Nitrile Gloves (L)',
    sku: 'PPE-202',
    category: 'Sanitation',
    unit: 'box',
    current_stock: 18,
    reorder_level: 40,
    daily_usage: 6,
    days_remaining: 3.0,
    risk: 'CRITICAL',
    updated_at: '2026-09-17 16:20:00',
    location: 'Cleanroom Storage C-2',
  },
  {
    id: 8,
    product_id: 8,
    product_name: 'Food-Grade Nitrogen Canisters',
    sku: 'GAS-004',
    category: 'Industrial Gas',
    unit: 'cylinder',
    current_stock: 14,
    reorder_level: 12,
    daily_usage: 1.2,
    days_remaining: 11.67,
    risk: 'MEDIUM',
    updated_at: '2026-09-17 14:00:00',
    location: 'Gas Enclosure G-01',
  }
];

export const initialRecommendations: ProcurementRecommendation[] = [
  {
    product_id: 5,
    product_name: 'Organic Cold-Pressed Orange Juice',
    sku: 'JUC-001',
    category: 'Beverage',
    unit: 'litre',
    current_stock: 32,
    reorder_level: 100,
    daily_usage: 12,
    days_remaining: 2.67,
    reorder_quantity: 136, // (12 * 14) - 32
    risk: 'CRITICAL',
    recommended_supplier_id: 1,
    recommended_supplier_name: 'ABC Foods Ltd.',
    unit_price: 85.00,
    estimated_cost: 11560.00,
    lead_time_days: 2,
    reasoning: 'Stock will deplete in 2.6 days at current 12 L/day consumption. Supplier ABC Foods provides 2-day guaranteed refrigerated delivery meeting SLA.',
    confidence_score: 96,
    suppliers: [
      { supplier_id: 1, supplier_name: 'ABC Foods Ltd.', price: 85.00, lead_time_days: 2, minimum_order_quantity: 40 },
    ]
  },
  {
    product_id: 7,
    product_name: 'Powder-Free Nitrile Gloves (L)',
    sku: 'PPE-202',
    category: 'Sanitation',
    unit: 'box',
    current_stock: 18,
    reorder_level: 40,
    daily_usage: 6,
    days_remaining: 3.0,
    reorder_quantity: 66, // (6 * 14) - 18
    risk: 'CRITICAL',
    recommended_supplier_id: 3,
    recommended_supplier_name: 'PQR Industrial Supplies',
    unit_price: 12.00,
    estimated_cost: 792.00,
    lead_time_days: 2,
    reasoning: 'Critical PPE threshold breached for packaging line sanitation. PQR has stock ready with 2-day dispatch.',
    confidence_score: 94,
    suppliers: [
      { supplier_id: 3, supplier_name: 'PQR Industrial Supplies', price: 12.00, lead_time_days: 2, minimum_order_quantity: 30 }
    ]
  },
  {
    product_id: 1,
    product_name: 'Premium Basmati Rice',
    sku: 'RIC-001',
    category: 'Food & Grains',
    unit: 'kg',
    current_stock: 120,
    reorder_level: 100,
    daily_usage: 35,
    days_remaining: 3.43,
    reorder_quantity: 370, // (35 * 14) - 120 = 490 - 120 = 370
    risk: 'HIGH',
    recommended_supplier_id: 1,
    recommended_supplier_name: 'ABC Foods Ltd.',
    unit_price: 62.50,
    estimated_cost: 23125.00,
    lead_time_days: 3,
    reasoning: 'Current stock runway is only 3.4 days. ABC Foods offers lowest unit price ($62.50 vs $65.00) and shorter lead time (3 vs 4 days).',
    confidence_score: 98,
    suppliers: [
      { supplier_id: 1, supplier_name: 'ABC Foods Ltd.', price: 62.50, lead_time_days: 3, minimum_order_quantity: 100 },
      { supplier_id: 2, supplier_name: 'XYZ Global Traders', price: 65.00, lead_time_days: 4, minimum_order_quantity: 80 }
    ]
  },
  {
    product_id: 3,
    product_name: 'Refined White Sugar',
    sku: 'SUG-001',
    category: 'Food & Grains',
    unit: 'kg',
    current_stock: 80,
    reorder_level: 100,
    daily_usage: 15,
    days_remaining: 5.33,
    reorder_quantity: 130, // (15 * 14) - 80 = 210 - 80 = 130
    risk: 'HIGH',
    recommended_supplier_id: 2,
    recommended_supplier_name: 'XYZ Global Traders',
    unit_price: 42.80,
    estimated_cost: 5564.00,
    lead_time_days: 4,
    reasoning: 'XYZ Global Traders offers 2.7% discount per kg ($42.80 vs $44.00) and meets the 14-day stock target within lead time window.',
    confidence_score: 92,
    suppliers: [
      { supplier_id: 2, supplier_name: 'XYZ Global Traders', price: 42.80, lead_time_days: 4, minimum_order_quantity: 100 },
      { supplier_id: 1, supplier_name: 'ABC Foods Ltd.', price: 44.00, lead_time_days: 2, minimum_order_quantity: 50 }
    ]
  },
  {
    product_id: 6,
    product_name: 'Heavy-Duty Corrugated Cartons',
    sku: 'PKG-101',
    category: 'Packaging',
    unit: 'unit',
    current_stock: 380,
    reorder_level: 500,
    daily_usage: 45,
    days_remaining: 8.44,
    reorder_quantity: 250, // (45 * 14) - 380 = 630 - 380 = 250 (round to MOQ 500)
    risk: 'MEDIUM',
    recommended_supplier_id: 4,
    recommended_supplier_name: 'Apex Packaging Solutions',
    unit_price: 3.40,
    estimated_cost: 1700.00,
    lead_time_days: 5,
    reasoning: 'Stock level dipped below 500 buffer target. Lead time is 5 business days, reorder now prevents packing halt.',
    confidence_score: 89,
    suppliers: [
      { supplier_id: 4, supplier_name: 'Apex Packaging Solutions', price: 3.40, lead_time_days: 5, minimum_order_quantity: 500 }
    ]
  }
];

export const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: 101,
    po_number: 'PO-2026-001',
    supplier_id: 1,
    supplier_name: 'ABC Foods Ltd.',
    supplier_email: 'procurement@abcfoods.com',
    status: 'PENDING_APPROVAL',
    total_amount: 11560.00,
    created_at: '2026-09-17 16:45:00',
    expected_delivery: '2026-09-19',
    notes: 'Urgent cold-chain restock generated by AI Reorder Agent for Orange Juice.',
    isAiGenerated: true,
    items: [
      {
        product_id: 5,
        product_name: 'Organic Cold-Pressed Orange Juice',
        sku: 'JUC-001',
        unit: 'litre',
        quantity: 136,
        unit_price: 85.00,
        total: 11560.00,
      }
    ]
  },
  {
    id: 102,
    po_number: 'PO-2026-002',
    supplier_id: 3,
    supplier_name: 'PQR Industrial Supplies',
    supplier_email: 'sales@pqrsupplies.com',
    status: 'PENDING_APPROVAL',
    total_amount: 792.00,
    created_at: '2026-09-17 15:10:00',
    expected_delivery: '2026-09-19',
    notes: 'Sanitation PPE reorder before weekend production shift.',
    isAiGenerated: true,
    items: [
      {
        product_id: 7,
        product_name: 'Powder-Free Nitrile Gloves (L)',
        sku: 'PPE-202',
        unit: 'box',
        quantity: 66,
        unit_price: 12.00,
        total: 792.00,
      }
    ]
  },
  {
    id: 103,
    po_number: 'PO-2026-003',
    supplier_id: 2,
    supplier_name: 'XYZ Global Traders',
    supplier_email: 'orders@xyztraders.com',
    status: 'APPROVED',
    total_amount: 16500.00,
    created_at: '2026-09-16 11:20:00',
    expected_delivery: '2026-09-20',
    approved_by: 'Sarah Jenkins (Procurement Lead)',
    notes: 'Bulk purchase order approved via automated threshold rule.',
    isAiGenerated: false,
    items: [
      {
        product_id: 2,
        product_name: 'Pure Refined Cooking Oil',
        sku: 'OIL-001',
        unit: 'litre',
        quantity: 150,
        unit_price: 110.00,
        total: 16500.00,
      }
    ]
  },
  {
    id: 104,
    po_number: 'PO-2026-004',
    supplier_id: 4,
    supplier_name: 'Apex Packaging Solutions',
    supplier_email: 'accounts@apexpack.io',
    status: 'SENT',
    total_amount: 1700.00,
    created_at: '2026-09-15 09:00:00',
    expected_delivery: '2026-09-20',
    approved_by: 'Marcus Vance (Operations Director)',
    notes: 'Dispatched via EDI transmission. Awaiting freight tracking confirmation.',
    isAiGenerated: false,
    items: [
      {
        product_id: 6,
        product_name: 'Heavy-Duty Corrugated Cartons',
        sku: 'PKG-101',
        unit: 'unit',
        quantity: 500,
        unit_price: 3.40,
        total: 1700.00,
      }
    ]
  },
  {
    id: 105,
    po_number: 'PO-2026-005',
    supplier_id: 3,
    supplier_name: 'PQR Industrial Supplies',
    supplier_email: 'sales@pqrsupplies.com',
    status: 'RECEIVED',
    total_amount: 3700.00,
    created_at: '2026-09-12 14:15:00',
    expected_delivery: '2026-09-15',
    approved_by: 'Sarah Jenkins',
    notes: 'Delivered and verified at Dock 2. QA inspection passed 100%.',
    isAiGenerated: false,
    items: [
      {
        product_id: 4,
        product_name: 'Antimicrobial Hand Soap',
        sku: 'SOAP-001',
        unit: 'unit',
        quantity: 200,
        unit_price: 18.50,
        total: 3700.00,
      }
    ]
  }
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'agent',
    timestamp: '10:00 AM',
    text: "Hello! I'm your SupplyChain AI Procurement Assistant. I actively monitor your inventory levels, lead times, and supplier quotes across all warehouses. How can I assist your operations today?",
  },
  {
    id: 'msg-2',
    sender: 'user',
    timestamp: '10:02 AM',
    text: 'What items are currently at critical stock risk and what suppliers should we use to reorder?',
  },
  {
    id: 'msg-3',
    sender: 'agent',
    timestamp: '10:02 AM',
    text: "I analyzed our real-time inventory and supplier database. We have **2 critical stockout risks** requiring immediate human attention:\n\n1. **Orange Juice (JUC-001)**: Only **2.67 days** of inventory remaining (32 L in stock, 12 L/day burn). I recommend **ABC Foods Ltd.** at $85/L (2-day lead time).\n2. **Nitrile Gloves (PPE-202)**: **3.0 days** of runway left (18 boxes in stock, 6 boxes/day burn). I recommend **PQR Industrial Supplies** at $12/box (2-day lead time).\n\nDraft purchase orders have been queued in your PO inbox awaiting your approval.",
    tools: [
      {
        tool_name: 'get_low_stock_inventory',
        args: {},
        status: 'completed',
        summary: 'Found 4 products below reorder buffer threshold'
      },
      {
        tool_name: 'get_product_suppliers',
        args: { product_id: 5 },
        status: 'completed',
        summary: 'ABC Foods quoted $85.00 with 2-day cold-chain lead time'
      }
    ],
    actionRecommendation: {
      type: 'PO_APPROVAL',
      title: '2 Purchase Orders Ready for Approval',
      details: 'PO-2026-001 ($11,560.00) & PO-2026-002 ($792.00) require manager sign-off.',
    }
  }
];
