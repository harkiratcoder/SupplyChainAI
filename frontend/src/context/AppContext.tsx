import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Product,
  Supplier,
  InventoryItem,
  ProcurementRecommendation,
  PurchaseOrder,
  ChatMessage,
  ToastNotification,
  RiskLevel
} from '../types';
import {
  initialProducts,
  initialSuppliers,
  initialInventory,
  initialRecommendations,
  initialPurchaseOrders,
  initialChatMessages,
} from '../data/mockData';

interface AppContextType {
  products: Product[];
  suppliers: Supplier[];
  inventory: InventoryItem[];
  recommendations: ProcurementRecommendation[];
  purchaseOrders: PurchaseOrder[];
  chatMessages: ChatMessage[];
  toasts: ToastNotification[];
  isAiTyping: boolean;

  // Actions
  addToast: (title: string, message: string, type?: ToastNotification['type']) => void;
  removeToast: (id: string) => void;
  approvePurchaseOrder: (poId: number) => void;
  sendPurchaseOrder: (poId: number) => void;
  receivePurchaseOrder: (poId: number) => void;
  cancelPurchaseOrder: (poId: number) => void;
  createPurchaseOrder: (
    supplierId: number,
    items: { product_id: number; quantity: number }[],
    notes?: string
  ) => PurchaseOrder;
  createPurchaseOrderFromRecommendation: (rec: ProcurementRecommendation) => PurchaseOrder;
  updateInventoryStock: (productId: number, newStock: number) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  addProduct: (
    product: Omit<Product, 'id'>,
    initialStock?: number,
    reorderLevel?: number,
    dailyUsage?: number
  ) => void;
  sendChatMessage: (text: string) => void;
  clearChat: () => void;
  resetToDefaults: () => void;

  // Computed metrics
  metrics: {
    totalSkus: number;
    totalStockUnits: number;
    criticalRiskCount: number;
    highRiskCount: number;
    pendingApprovalsCount: number;
    activeSuppliersCount: number;
    totalPendingPoValue: number;
    avgSupplierOnTimeRate: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'supplychain_ai_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'suppliers');
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [recommendations, setRecommendations] = useState<ProcurementRecommendation[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'recommendations');
    return saved ? JSON.parse(saved) : initialRecommendations;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'purchase_orders');
    return saved ? JSON.parse(saved) : initialPurchaseOrders;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'chat_messages');
    return saved ? JSON.parse(saved) : initialChatMessages;
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'recommendations', JSON.stringify(recommendations));
  }, [recommendations]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'purchase_orders', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const addToast = (title: string, message: string, type: ToastNotification['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type, timestamp: new Date().toLocaleTimeString() }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const calculateRisk = (daysRemaining: number | null): RiskLevel => {
    if (daysRemaining === null) return 'LOW';
    if (daysRemaining < 3) return 'CRITICAL';
    if (daysRemaining < 7) return 'HIGH';
    if (daysRemaining <= 14) return 'MEDIUM';
    return 'LOW';
  };

  // Recalculate recommendations from current inventory
  const recalculateRecommendations = (currentInv: InventoryItem[], currentSuppliers: Supplier[]) => {
    const lowStock = currentInv.filter((item) => item.current_stock <= item.reorder_level);

    const recs: ProcurementRecommendation[] = lowStock.map((inv) => {
      // Reorder quantity target = (daily_usage * 14) - current_stock
      const targetDays = 14;
      const targetStock = inv.daily_usage * targetDays;
      let reorderQty = Math.max(0, Math.round(targetStock - inv.current_stock));

      // find suppliers for this product
      const availableSuppliers: {
        supplier_id: number;
        supplier_name: string;
        price: number;
        lead_time_days: number;
        minimum_order_quantity: number;
      }[] = [];

      currentSuppliers.forEach((s) => {
        const supProduct = s.productsSupplied.find((p) => p.product_id === inv.product_id);
        if (supProduct) {
          availableSuppliers.push({
            supplier_id: s.id,
            supplier_name: s.name,
            price: supProduct.price,
            lead_time_days: supProduct.lead_time_days,
            minimum_order_quantity: supProduct.moq,
          });
        }
      });

      // Sort by price ascending
      availableSuppliers.sort((a, b) => a.price - b.price);

      const bestSupplier = availableSuppliers[0] || {
        supplier_id: 1,
        supplier_name: 'Primary Sourcing Partner',
        price: 50.0,
        lead_time_days: 3,
        minimum_order_quantity: 50,
      };

      if (reorderQty < bestSupplier.minimum_order_quantity) {
        reorderQty = bestSupplier.minimum_order_quantity;
      }

      const estimatedCost = reorderQty * bestSupplier.price;

      return {
        product_id: inv.product_id,
        product_name: inv.product_name,
        sku: inv.sku,
        category: inv.category,
        unit: inv.unit,
        current_stock: inv.current_stock,
        reorder_level: inv.reorder_level,
        daily_usage: inv.daily_usage,
        days_remaining: inv.days_remaining,
        reorder_quantity: reorderQty,
        risk: inv.risk,
        suppliers: availableSuppliers,
        recommended_supplier_id: bestSupplier.supplier_id,
        recommended_supplier_name: bestSupplier.supplier_name,
        unit_price: bestSupplier.price,
        estimated_cost: estimatedCost,
        lead_time_days: bestSupplier.lead_time_days,
        confidence_score: inv.risk === 'CRITICAL' ? 97 : inv.risk === 'HIGH' ? 94 : 88,
        reasoning: `Stock runway is ${inv.days_remaining ? inv.days_remaining.toFixed(1) : 'unknown'} days. Recommended order of ${reorderQty} ${inv.unit} from ${bestSupplier.supplier_name} to guarantee 14-day operational safety buffer.`,
      };
    });

    setRecommendations(recs);
  };

  const updateInventoryStock = (productId: number, newStock: number) => {
    setInventory((prev) => {
      const updated = prev.map((item) => {
        if (item.product_id === productId) {
          const days = item.daily_usage > 0 ? +(newStock / item.daily_usage).toFixed(2) : null;
          const risk = calculateRisk(days);
          return {
            ...item,
            current_stock: newStock,
            days_remaining: days,
            risk,
            updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
          };
        }
        return item;
      });
      recalculateRecommendations(updated, suppliers);
      return updated;
    });

    const prod = products.find((p) => p.id === productId);
    addToast(
      'Stock Updated',
      `Inventory stock level for ${prod ? prod.name : `Product #${productId}`} set to ${newStock}.`,
      'success'
    );
  };

  const approvePurchaseOrder = (poId: number) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id === poId) {
          return {
            ...po,
            status: 'APPROVED',
            approved_by: 'Alex Morgan (Procurement Manager)',
          };
        }
        return po;
      })
    );
    addToast('Purchase Order Approved', `PO #${poId} approved and ready for dispatch.`, 'success');
  };

  const sendPurchaseOrder = (poId: number) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id === poId) {
          return {
            ...po,
            status: 'SENT',
          };
        }
        return po;
      })
    );
    addToast('Purchase Order Sent', `PO #${poId} transmitted to supplier electronically.`, 'info');
  };

  const receivePurchaseOrder = (poId: number) => {
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po) return;

    // Update PO status to RECEIVED
    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === poId ? { ...p, status: 'RECEIVED' } : p))
    );

    // Increase stock for each item in the PO
    setInventory((prev) => {
      const updated = prev.map((inv) => {
        const poItem = po.items.find((item) => item.product_id === inv.product_id);
        if (poItem) {
          const newStock = inv.current_stock + poItem.quantity;
          const days = inv.daily_usage > 0 ? +(newStock / inv.daily_usage).toFixed(2) : null;
          return {
            ...inv,
            current_stock: newStock,
            days_remaining: days,
            risk: calculateRisk(days),
            updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
          };
        }
        return inv;
      });
      recalculateRecommendations(updated, suppliers);
      return updated;
    });

    addToast(
      'Shipment Received',
      `PO #${poId} marked as received. Inventory balances have been automatically updated.`,
      'success'
    );
  };

  const cancelPurchaseOrder = (poId: number) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === poId ? { ...po, status: 'CANCELLED' } : po))
    );
    addToast('Purchase Order Cancelled', `PO #${poId} has been cancelled.`, 'warning');
  };

  const createPurchaseOrder = (
    supplierId: number,
    items: { product_id: number; quantity: number }[],
    notes?: string
  ): PurchaseOrder => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    if (!supplier) throw new Error('Supplier not found');

    let totalAmount = 0;
    const poItems = items.map((item) => {
      const prod = products.find((p) => p.id === item.product_id);
      const supProduct = supplier.productsSupplied.find((sp) => sp.product_id === item.product_id);
      const unitPrice = supProduct ? supProduct.price : 50;
      const total = +(unitPrice * item.quantity).toFixed(2);
      totalAmount += total;

      return {
        product_id: item.product_id,
        product_name: prod ? prod.name : `Product #${item.product_id}`,
        sku: prod ? prod.sku : 'SKU-UNKNOWN',
        unit: prod ? prod.unit : 'units',
        quantity: item.quantity,
        unit_price: unitPrice,
        total,
      };
    });

    const newId = 100 + purchaseOrders.length + 1;
    const poNumber = `PO-2026-${String(newId).padStart(3, '0')}`;

    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + (supplier.leadTimeAvgDays || 3));

    const newPO: PurchaseOrder = {
      id: newId,
      po_number: poNumber,
      supplier_id: supplier.id,
      supplier_name: supplier.name,
      supplier_email: supplier.email,
      status: 'PENDING_APPROVAL',
      total_amount: +totalAmount.toFixed(2),
      items: poItems,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      expected_delivery: expectedDate.toISOString().split('T')[0],
      notes: notes || 'Created manually via SupplyChain AI procurement console.',
      isAiGenerated: false,
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);
    addToast('Purchase Order Drafted', `${poNumber} created with total $${newPO.total_amount.toLocaleString()}.`, 'success');
    return newPO;
  };

  const createPurchaseOrderFromRecommendation = (rec: ProcurementRecommendation): PurchaseOrder => {
    const supplier = suppliers.find((s) => s.id === rec.recommended_supplier_id) || suppliers[0];
    const newId = 100 + purchaseOrders.length + 1;
    const poNumber = `PO-2026-${String(newId).padStart(3, '0')}`;

    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + rec.lead_time_days);

    const newPO: PurchaseOrder = {
      id: newId,
      po_number: poNumber,
      supplier_id: supplier.id,
      supplier_name: supplier.name,
      supplier_email: supplier.email,
      status: 'PENDING_APPROVAL',
      total_amount: rec.estimated_cost,
      items: [
        {
          product_id: rec.product_id,
          product_name: rec.product_name,
          sku: rec.sku,
          unit: rec.unit,
          quantity: rec.reorder_quantity,
          unit_price: rec.unit_price,
          total: rec.estimated_cost,
        },
      ],
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      expected_delivery: expectedDate.toISOString().split('T')[0],
      notes: `Generated by AI Reorder Intelligence for SKU ${rec.sku}. Justification: ${rec.reasoning}`,
      isAiGenerated: true,
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);
    addToast(
      'PO Created from AI Recommendation',
      `${poNumber} created for ${rec.product_name} ($${rec.estimated_cost.toLocaleString()}). Requires approval.`,
      'success'
    );
    return newPO;
  };

  const addSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newId = suppliers.length > 0 ? Math.max(...suppliers.map((s) => s.id)) + 1 : 1;
    const newSupplier: Supplier = {
      ...supplierData,
      id: newId,
    };
    setSuppliers((prev) => [...prev, newSupplier]);
    addToast('Supplier Added', `${newSupplier.name} added to vendor database.`, 'success');
  };

  const addProduct = (
    productData: Omit<Product, 'id'>,
    initialStock: number = 100,
    reorderLevel: number = 80,
    dailyUsage: number = 10
  ) => {
    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const newProduct: Product = {
      ...productData,
      id: newId,
    };
    setProducts((prev) => [...prev, newProduct]);

    const daysRemaining = dailyUsage > 0 ? +(initialStock / dailyUsage).toFixed(2) : null;
    const newInv: InventoryItem = {
      id: inventory.length + 1,
      product_id: newId,
      product_name: newProduct.name,
      sku: newProduct.sku,
      category: newProduct.category,
      unit: newProduct.unit,
      current_stock: initialStock,
      reorder_level: reorderLevel,
      daily_usage: dailyUsage,
      days_remaining: daysRemaining,
      risk: calculateRisk(daysRemaining),
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      location: 'Main Distribution Center',
    };

    setInventory((prev) => {
      const updated = [...prev, newInv];
      recalculateRecommendations(updated, suppliers);
      return updated;
    });

    addToast('Product Added', `${newProduct.name} (${newProduct.sku}) added to catalog.`, 'success');
  };

  // AI Assistant Chat simulator mirroring Gemini backend tools
  const sendChatMessage = (userText: string) => {
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: userText,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let responseText = '';
      const tools: ChatMessage['tools'] = [];
      let actionRec: ChatMessage['actionRecommendation'] = undefined;

      if (lower.includes('low stock') || lower.includes('risk') || lower.includes('deplet') || lower.includes('critical')) {
        tools.push({
          tool_name: 'get_low_stock_inventory',
          args: {},
          status: 'completed',
          summary: `Identified ${inventory.filter((i) => i.risk === 'CRITICAL' || i.risk === 'HIGH').length} items with runway below safety buffer.`,
        });

        const criticalItems = inventory.filter((i) => i.risk === 'CRITICAL');
        const highItems = inventory.filter((i) => i.risk === 'HIGH');

        responseText = `### Inventory Risk Assessment\n\nI queried the live inventory database and identified **${criticalItems.length} critical** and **${highItems.length} high-risk** items:\n\n` +
          criticalItems.map((i) => `* ⚠️ **${i.product_name} (${i.sku})**: **${i.current_stock} ${i.unit}** remaining (~${i.days_remaining} days). Daily consumption is ${i.daily_usage} ${i.unit}/day.`).join('\n') +
          `\n\n` +
          highItems.map((i) => `* 🟡 **${i.product_name} (${i.sku})**: **${i.current_stock} ${i.unit}** remaining (~${i.days_remaining} days). Reorder threshold is ${i.reorder_level} ${i.unit}.`).join('\n') +
          `\n\nWould you like me to generate draft purchase orders for these critical items?`;

        actionRec = {
          type: 'RESTOCK_PLAN',
          title: 'Stockout Mitigation Plan',
          details: 'Ready to dispatch reorder requests to preferred suppliers with shortest lead times.',
        };
      } else if (lower.includes('supplier') || lower.includes('quote') || lower.includes('price') || lower.includes('cost')) {
        tools.push({
          tool_name: 'get_product_suppliers',
          args: { product_id: 1 },
          status: 'completed',
          summary: 'Queried active supplier catalogs and volume MOQ pricing.',
        });

        responseText = `### Supplier Matrix Evaluation\n\nHere is the current comparative pricing for our active vendors:\n\n` +
          suppliers.map((s) => `* **${s.name}**: ${s.rating} ★ | ${s.leadTimeAvgDays} days avg lead time | ${s.onTimeDeliveryRate}% on-time rate | Terms: ${s.paymentTerms}`).join('\n') +
          `\n\n**Recommendation**: For fast-turnaround raw goods, **PQR Industrial Supplies** and **ABC Foods Ltd.** hold our highest tier reliability SLAs (99.1% and 98.2% respectively).`;

        actionRec = {
          type: 'SUPPLIER_ALERT',
          title: 'Vendor Optimization',
          details: 'ABC Foods offers the lowest unit cost for Basmati Rice ($62.50/kg vs $65.00/kg from XYZ).',
        };
      } else if (lower.includes('order') || lower.includes('po') || lower.includes('purchase')) {
        const pendingCount = purchaseOrders.filter((p) => p.status === 'PENDING_APPROVAL').length;
        responseText = `You currently have **${pendingCount} purchase orders** in \`PENDING_APPROVAL\` status.\n\nAll orders remain paused until verified by a manager. You can review the line items and click **Approve PO** on the Purchase Orders page to release them for transmission.`;

        actionRec = {
          type: 'PO_APPROVAL',
          title: `${pendingCount} POs Requiring Approval`,
          details: 'Manager authorization required before transmitting orders to vendors.',
        };
      } else {
        responseText = `I have cross-checked our supply chain telemetries. We are currently tracking **${inventory.length} active SKUs** across all distribution channels.\n\n` +
          `Key Highlights:\n` +
          `• **${inventory.filter((i) => i.risk === 'CRITICAL').length} items** are at critical depletion (<3 days runway).\n` +
          `• **${purchaseOrders.filter((p) => p.status === 'PENDING_APPROVAL').length} purchase orders** require manager authorization.\n` +
          `• Overall supplier reliability is running at **97.0% on-time delivery**.\n\n` +
          `You can ask me to evaluate stockout risks, compare supplier terms, or draft purchase orders.`;
      }

      const agentMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: responseText,
        tools,
        actionRecommendation: actionRec,
      };

      setChatMessages((prev) => [...prev, agentMsg]);
      setIsAiTyping(false);
    }, 700);
  };

  const clearChat = () => {
    setChatMessages([initialChatMessages[0]]);
    addToast('Chat Reset', 'AI assistant conversation history cleared.', 'info');
  };

  const resetToDefaults = () => {
    setProducts(initialProducts);
    setSuppliers(initialSuppliers);
    setInventory(initialInventory);
    setRecommendations(initialRecommendations);
    setPurchaseOrders(initialPurchaseOrders);
    setChatMessages(initialChatMessages);
    const savedTheme = localStorage.getItem('supplychain_ai_theme');
    localStorage.clear();
    if (savedTheme) {
      localStorage.setItem('supplychain_ai_theme', savedTheme);
    }
    addToast('Data Reset', 'All records restored to initial demo enterprise state.', 'info');
  };

  // Metrics
  const metrics = {
    totalSkus: products.length,
    totalStockUnits: inventory.reduce((acc, curr) => acc + curr.current_stock, 0),
    criticalRiskCount: inventory.filter((i) => i.risk === 'CRITICAL').length,
    highRiskCount: inventory.filter((i) => i.risk === 'HIGH').length,
    pendingApprovalsCount: purchaseOrders.filter((po) => po.status === 'PENDING_APPROVAL').length,
    activeSuppliersCount: suppliers.length,
    totalPendingPoValue: purchaseOrders
      .filter((po) => po.status === 'PENDING_APPROVAL')
      .reduce((acc, curr) => acc + curr.total_amount, 0),
    avgSupplierOnTimeRate: +(
      suppliers.reduce((acc, curr) => acc + curr.onTimeDeliveryRate, 0) / (suppliers.length || 1)
    ).toFixed(1),
  };

  return (
    <AppContext.Provider
      value={{
        products,
        suppliers,
        inventory,
        recommendations,
        purchaseOrders,
        chatMessages,
        toasts,
        isAiTyping,
        addToast,
        removeToast,
        approvePurchaseOrder,
        sendPurchaseOrder,
        receivePurchaseOrder,
        cancelPurchaseOrder,
        createPurchaseOrder,
        createPurchaseOrderFromRecommendation,
        updateInventoryStock,
        addSupplier,
        addProduct,
        sendChatMessage,
        clearChat,
        resetToDefaults,
        metrics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
