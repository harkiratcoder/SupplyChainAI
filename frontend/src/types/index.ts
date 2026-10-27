export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type PurchaseOrderStatus = 
  | 'PENDING_APPROVAL' 
  | 'APPROVED' 
  | 'SENT' 
  | 'RECEIVED' 
  | 'CANCELLED';

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  unit: string;
  description?: string;
}

export interface SupplierProductRate {
  supplier_id: number;
  supplier_name: string;
  email?: string;
  phone?: string;
  price: number;
  lead_time_days: number;
  minimum_order_quantity: number;
}

export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  rating: number; // e.g. 4.8
  leadTimeAvgDays: number;
  onTimeDeliveryRate: number; // e.g. 98.5%
  status: 'ACTIVE' | 'PREFERRED' | 'UNDER_REVIEW';
  paymentTerms: string;
  productsSupplied: {
    product_id: number;
    product_name: string;
    sku: string;
    price: number;
    lead_time_days: number;
    moq: number;
  }[];
}

export interface InventoryItem {
  id: number;
  product_id: number;
  product_name: string;
  sku: string;
  category: string;
  unit: string;
  current_stock: number;
  reorder_level: number;
  daily_usage: number;
  days_remaining: number | null;
  risk: RiskLevel;
  updated_at: string;
  location?: string;
}

export interface ProcurementRecommendation {
  product_id: number;
  product_name: string;
  sku: string;
  category: string;
  unit: string;
  current_stock: number;
  reorder_level: number;
  daily_usage: number;
  days_remaining: number | null;
  reorder_quantity: number;
  risk: RiskLevel;
  suppliers: SupplierProductRate[];
  recommended_supplier_id: number;
  recommended_supplier_name: string;
  unit_price: number;
  estimated_cost: number;
  lead_time_days: number;
  reasoning: string;
  confidence_score: number;
}

export interface PurchaseOrderItem {
  product_id: number;
  product_name: string;
  sku: string;
  unit: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier_id: number;
  supplier_name: string;
  supplier_email: string;
  status: PurchaseOrderStatus;
  total_amount: number;
  items: PurchaseOrderItem[];
  created_at: string;
  expected_delivery: string;
  approved_by?: string;
  notes?: string;
  isAiGenerated?: boolean;
}

export interface AgentToolExecution {
  tool_name: string;
  args: Record<string, unknown>;
  status: 'executing' | 'completed' | 'error';
  summary?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: string;
  text: string;
  tools?: AgentToolExecution[];
  actionRecommendation?: {
    type: 'PO_APPROVAL' | 'RESTOCK_PLAN' | 'SUPPLIER_ALERT';
    title: string;
    details: string;
    payload?: unknown;
  };
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: string;
}
