import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  PackageCheck,
  CheckCircle2,
  Eye,
  Send,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { SearchBar } from '../components/common/SearchBar';
import { FilterDropdown } from '../components/common/FilterDropdown';
import { StatusBadge } from '../components/common/StatusBadge';
import { DataTable } from '../components/common/DataTable';
import type { Column } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import type { PurchaseOrder } from '../types';

export const PurchaseOrders: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    purchaseOrders,
    suppliers,
    products,
    approvePurchaseOrder,
    sendPurchaseOrder,
    receivePurchaseOrder,
    cancelPurchaseOrder,
    createPurchaseOrder
  } = useApp();

  const viewPoId = searchParams.get('view');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modal states
  const [selectedPoForDetails, setSelectedPoForDetails] = useState<PurchaseOrder | null>(null);
  const [isNewPoModalOpen, setIsNewPoModalOpen] = useState(false);

  // New PO manual form state
  const [selectedSupplierId, setSelectedSupplierId] = useState<number>(suppliers[0]?.id || 1);
  const [selectedProductId, setSelectedProductId] = useState<number>(products[0]?.id || 1);
  const [orderQuantity, setOrderQuantity] = useState<number>(100);
  const [orderNotes, setOrderNotes] = useState<string>('');

  // Handle URL query parameter `?view=101`
  useEffect(() => {
    if (viewPoId) {
      const found = purchaseOrders.find((p) => String(p.id) === viewPoId);
      if (found) {
        setSelectedPoForDetails(found);
      }
    }
  }, [viewPoId, purchaseOrders]);

  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter((po) => {
      const matchesSearch =
        po.po_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.supplier_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.items.some((i) => i.product_name.toLowerCase().includes(searchQuery.toLowerCase()) || i.sku.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = selectedStatus === 'ALL' || po.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [purchaseOrders, searchQuery, selectedStatus]);

  const handleCreateNewPo = (e: React.FormEvent) => {
    e.preventDefault();
    createPurchaseOrder(
      Number(selectedSupplierId),
      [{ product_id: Number(selectedProductId), quantity: Number(orderQuantity) }],
      orderNotes
    );
    setIsNewPoModalOpen(false);
    setOrderNotes('');
  };

  const columns: Column<PurchaseOrder>[] = [
    {
      header: 'PO Number',
      accessorKey: 'po_number',
      sortable: true,
      cell: (po) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-slate-900 dark:text-white">{po.po_number}</span>
          {po.isAiGenerated && (
            <span className="inline-flex items-center gap-1 rounded bg-brand-50 dark:bg-blue-950/50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700 dark:text-blue-300 border border-brand-200 dark:border-blue-800/50">
              <Sparkles className="w-2.5 h-2.5" />
              AI
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Supplier',
      accessorKey: 'supplier_name',
      sortable: true,
      cell: (po) => (
        <div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">{po.supplier_name}</div>
          <div className="text-xs text-slate-400 dark:text-slate-500">{po.supplier_email}</div>
        </div>
      ),
    },
    {
      header: 'Items',
      cell: (po) => (
        <div className="text-xs text-slate-700 dark:text-slate-300">
          <span className="font-medium">{po.items.length} SKU(s)</span>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[200px]">
            {po.items.map((i) => `${i.quantity} ${i.unit} ${i.product_name}`).join(', ')}
          </p>
        </div>
      ),
    },
    {
      header: 'Total Value',
      accessorKey: 'total_amount',
      sortable: true,
      cell: (po) => (
        <div className="font-bold text-slate-900 dark:text-white text-sm">
          ${po.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (po) => <StatusBadge status={po.status} size="sm" />,
    },
    {
      header: 'Expected Delivery',
      accessorKey: 'expected_delivery',
      sortable: true,
      cell: (po) => (
        <div className="text-xs text-slate-600 dark:text-slate-300 font-mono">
          {po.expected_delivery}
        </div>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      cell: (po) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedPoForDetails(po)}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="Inspect Line Items"
          >
            <Eye className="w-4 h-4" />
          </button>

          {po.status === 'PENDING_APPROVAL' && (
            <button
              type="button"
              onClick={() => approvePurchaseOrder(po.id)}
              className="btn-primary text-xs py-1 px-2 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Approve</span>
            </button>
          )}

          {po.status === 'APPROVED' && (
            <button
              type="button"
              onClick={() => sendPurchaseOrder(po.id)}
              className="btn-primary text-xs py-1 px-2 bg-brand-600 hover:bg-brand-700"
            >
              <Send className="w-3 h-3" />
              <span>Dispatch</span>
            </button>
          )}

          {po.status === 'SENT' && (
            <button
              type="button"
              onClick={() => receivePurchaseOrder(po.id)}
              className="btn-primary text-xs py-1 px-2 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
            >
              <PackageCheck className="w-3 h-3" />
              <span>Receive Stock</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Order Management"
        subtitle="End-to-end procurement order workflow with strict human-in-the-loop authorization gates."
        actions={
          <button
            type="button"
            onClick={() => setIsNewPoModalOpen(true)}
            className="btn-primary text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Purchase Order</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="sc-card p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search PO #, supplier, or product..."
          />

          <div className="flex items-center gap-2">
            <FilterDropdown
              label="Lifecycle Status"
              options={[
                { label: 'All Statuses', value: 'ALL' },
                { label: 'Pending Approval', value: 'PENDING_APPROVAL' },
                { label: 'Approved', value: 'APPROVED' },
                { label: 'Sent to Supplier', value: 'SENT' },
                { label: 'Received & Logged', value: 'RECEIVED' },
              ]}
              selectedValue={selectedStatus}
              onChange={setSelectedStatus}
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        keyExtractor={(po) => po.id}
        pageSize={10}
        emptyTitle="No purchase orders found"
        emptyDescription="There are no purchase orders matching the specified filter criteria."
      />

      {/* Purchase Order Detail Modal */}
      <Modal
        isOpen={!!selectedPoForDetails}
        onClose={() => {
          setSelectedPoForDetails(null);
          setSearchParams({});
        }}
        title={`Purchase Order: ${selectedPoForDetails?.po_number}`}
        subtitle={`Created: ${selectedPoForDetails?.created_at} • Expected Delivery: ${selectedPoForDetails?.expected_delivery}`}
        maxWidth="2xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {selectedPoForDetails?.status === 'PENDING_APPROVAL' && (
                <button
                  type="button"
                  onClick={() => {
                    if (selectedPoForDetails) {
                      cancelPurchaseOrder(selectedPoForDetails.id);
                      setSelectedPoForDetails(null);
                    }
                  }}
                  className="btn-danger text-xs"
                >
                  Cancel Order
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedPoForDetails(null);
                  setSearchParams({});
                }}
                className="btn-secondary text-xs"
              >
                Close
              </button>

              {selectedPoForDetails?.status === 'PENDING_APPROVAL' && (
                <button
                  type="button"
                  onClick={() => {
                    if (selectedPoForDetails) {
                      approvePurchaseOrder(selectedPoForDetails.id);
                      setSelectedPoForDetails({
                        ...selectedPoForDetails,
                        status: 'APPROVED',
                        approved_by: 'Alex Morgan (Procurement Manager)',
                      });
                    }
                  }}
                  className="btn-primary text-xs bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authorize & Approve PO</span>
                </button>
              )}

              {selectedPoForDetails?.status === 'APPROVED' && (
                <button
                  type="button"
                  onClick={() => {
                    if (selectedPoForDetails) {
                      sendPurchaseOrder(selectedPoForDetails.id);
                      setSelectedPoForDetails({ ...selectedPoForDetails, status: 'SENT' });
                    }
                  }}
                  className="btn-primary text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit to Vendor</span>
                </button>
              )}

              {selectedPoForDetails?.status === 'SENT' && (
                <button
                  type="button"
                  onClick={() => {
                    if (selectedPoForDetails) {
                      receivePurchaseOrder(selectedPoForDetails.id);
                      setSelectedPoForDetails({ ...selectedPoForDetails, status: 'RECEIVED' });
                    }
                  }}
                  className="btn-primary text-xs bg-indigo-600 hover:bg-indigo-700"
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>Confirm Receipt & Update Inventory</span>
                </button>
              )}
            </div>
          </div>
        }
      >
        {selectedPoForDetails && (
          <div className="space-y-4">
            {/* Header info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-850 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Supplier</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedPoForDetails.supplier_name}</span>
                <span className="text-slate-500 dark:text-slate-400 block truncate">{selectedPoForDetails.supplier_email}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Status</span>
                <div className="mt-1">
                  <StatusBadge status={selectedPoForDetails.status} size="sm" />
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Authorized By</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {selectedPoForDetails.approved_by || 'Pending Authorization'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Total Amount</span>
                <span className="text-base font-extrabold text-brand-700 dark:text-blue-400 font-mono">
                  ${selectedPoForDetails.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Line items table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Order Line Items ({selectedPoForDetails.items.length})
              </h4>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-850 font-semibold text-slate-600 dark:text-slate-300">
                    <tr>
                      <th className="px-3 py-2.5 text-left">Product Name</th>
                      <th className="px-3 py-2.5 text-left">SKU</th>
                      <th className="px-3 py-2.5 text-right">Quantity</th>
                      <th className="px-3 py-2.5 text-right">Contract Rate</th>
                      <th className="px-3 py-2.5 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {selectedPoForDetails.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850/60">
                        <td className="px-3 py-2.5 font-medium text-slate-900 dark:text-white">
                          {item.product_name}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-slate-500 dark:text-slate-400">
                          {item.sku}
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold text-slate-800 dark:text-slate-200">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-slate-600 dark:text-slate-300">
                          ${item.unit_price.toFixed(2)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-bold text-slate-900 dark:text-white">
                          ${item.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            {selectedPoForDetails.notes && (
              <div className="rounded-lg bg-slate-50 dark:bg-slate-850 p-3 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">Procurement Notes:</span>
                {selectedPoForDetails.notes}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Manual PO Creation Modal */}
      <Modal
        isOpen={isNewPoModalOpen}
        onClose={() => setIsNewPoModalOpen(false)}
        title="Draft Manual Purchase Order"
        subtitle="Select a contracted supplier, pick catalog products, and queue for manager sign-off."
        maxWidth="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsNewPoModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateNewPo}
              className="btn-primary"
            >
              Draft Purchase Order
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateNewPo} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Supplier *
            </label>
            <select
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(Number(e.target.value))}
              className="form-input"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.paymentTerms} • {s.leadTimeAvgDays}d lead)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Product *
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(Number(e.target.value))}
                className="form-input"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Order Quantity *
              </label>
              <input
                type="number"
                min="1"
                required
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(Number(e.target.value))}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Procurement Justification / Notes
            </label>
            <textarea
              rows={3}
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="e.g. Expedited order requested for production line replenishment."
              className="form-input"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
