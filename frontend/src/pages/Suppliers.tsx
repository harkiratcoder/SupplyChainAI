import React, { useState, useMemo } from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Star,
  Plus,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { SearchBar } from '../components/common/SearchBar';
import { FilterDropdown } from '../components/common/FilterDropdown';
import { Modal } from '../components/common/Modal';
import type { Supplier } from '../types';

export const Suppliers: React.FC = () => {
  const { suppliers, addSupplier } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modals
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [selectedSupplierForDetails, setSelectedSupplierForDetails] = useState<Supplier | null>(null);

  const [newSupplierForm, setNewSupplierForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentTerms: 'Net 30',
    leadTimeAvgDays: 3,
  });

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const matchesSearch =
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === 'ALL' || supplier.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [suppliers, searchQuery, selectedStatus]);

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    addSupplier({
      name: newSupplierForm.name,
      email: newSupplierForm.email,
      phone: newSupplierForm.phone,
      address: newSupplierForm.address,
      paymentTerms: newSupplierForm.paymentTerms,
      leadTimeAvgDays: Number(newSupplierForm.leadTimeAvgDays),
      rating: 4.8,
      onTimeDeliveryRate: 98.0,
      status: 'ACTIVE',
      productsSupplied: [],
    });
    setIsAddSupplierOpen(false);
    setNewSupplierForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      paymentTerms: 'Net 30',
      leadTimeAvgDays: 3,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supplier Directory & Intelligence"
        subtitle="SLA performance metrics, contracted unit pricing, lead-time benchmarking, and contact profiles."
        actions={
          <button
            type="button"
            onClick={() => setIsAddSupplierOpen(true)}
            className="btn-primary text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Supplier</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="sc-card p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search suppliers by name, email, city..."
          />

          <div className="flex items-center gap-2">
            <FilterDropdown
              label="Tier"
              options={[
                { label: 'All Suppliers', value: 'ALL' },
                { label: 'Preferred Tier', value: 'PREFERRED' },
                { label: 'Active Standard', value: 'ACTIVE' },
              ]}
              selectedValue={selectedStatus}
              onChange={setSelectedStatus}
            />
          </div>
        </div>
      </div>

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="sc-card p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-brand-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center font-bold text-base shadow-xs">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {supplier.name}
                      </h3>
                      {supplier.status === 'PREFERRED' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/50">
                          <CheckCircle2 className="w-3 h-3 text-brand-600 dark:text-brand-400" />
                          Preferred Vendor
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1 text-amber-600 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {supplier.rating} / 5.0
                      </span>
                      <span>•</span>
                      <span>Terms: {supplier.paymentTerms}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedSupplierForDetails(supplier)}
                  className="btn-ghost text-xs p-1.5 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-blue-400"
                  title="View Contracted Price Matrix"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <div className="bg-slate-50 dark:bg-slate-800/70 rounded-lg p-2">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500 block">
                    Avg Lead Time
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {supplier.leadTimeAvgDays} days
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/70 rounded-lg p-2">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500 block">
                    On-Time SLA
                  </span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {supplier.onTimeDeliveryRate}%
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/70 rounded-lg p-2">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500 block">
                    Catalog SKUs
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {supplier.productsSupplied.length} items
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <a
                    href={`mailto:${supplier.email}`}
                    className="hover:text-brand-600 dark:hover:text-blue-400 truncate"
                  >
                    {supplier.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span className="truncate">{supplier.address}</span>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[260px]">
                {supplier.productsSupplied.length > 0
                  ? `Supplies: ${supplier.productsSupplied.map((p) => p.product_name).join(', ')}`
                  : 'No products registered yet'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedSupplierForDetails(supplier)}
                className="btn-secondary text-xs py-1 px-2.5 shrink-0"
              >
                Catalog & Prices
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Supplier Price Matrix Modal */}
      <Modal
        isOpen={!!selectedSupplierForDetails}
        onClose={() => setSelectedSupplierForDetails(null)}
        title={`${selectedSupplierForDetails?.name} — Catalog & Pricing Matrix`}
        subtitle="Contracted unit rates, dispatch lead-times, and minimum order thresholds."
        maxWidth="2xl"
        footer={
          <button
            type="button"
            onClick={() => setSelectedSupplierForDetails(null)}
            className="btn-primary"
          >
            Done
          </button>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 dark:bg-slate-850 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Payment Terms</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedSupplierForDetails?.paymentTerms}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Lead Time</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedSupplierForDetails?.leadTimeAvgDays} business days</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Reliability SLA</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedSupplierForDetails?.onTimeDeliveryRate}% on-time</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Contract Rating</span>
              <span className="font-semibold text-amber-600">{selectedSupplierForDetails?.rating} ★</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 font-semibold text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="px-3 py-2.5 text-left">Product Item</th>
                  <th className="px-3 py-2.5 text-left">SKU</th>
                  <th className="px-3 py-2.5 text-right">Unit Price</th>
                  <th className="px-3 py-2.5 text-right">Lead Time</th>
                  <th className="px-3 py-2.5 text-right">MOQ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {selectedSupplierForDetails?.productsSupplied.map((prod) => (
                  <tr key={prod.product_id} className="hover:bg-slate-50 dark:hover:bg-slate-850/60">
                    <td className="px-3 py-2.5 font-medium text-slate-900 dark:text-white">
                      {prod.product_name}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-slate-500 dark:text-slate-400">
                      {prod.sku}
                    </td>
                    <td className="px-3 py-2.5 text-right font-bold text-brand-600 dark:text-blue-400">
                      ${prod.price.toFixed(2)}
                    </td>
                    <td className="px-3 py-2.5 text-right text-slate-700 dark:text-slate-300">
                      {prod.lead_time_days} days
                    </td>
                    <td className="px-3 py-2.5 text-right text-slate-700 dark:text-slate-300">
                      {prod.moq.toLocaleString()} units
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* Add Supplier Modal */}
      <Modal
        isOpen={isAddSupplierOpen}
        onClose={() => setIsAddSupplierOpen(false)}
        title="Onboard New Supplier"
        subtitle="Register vendor profile, contact records, and baseline logistics parameters."
        maxWidth="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAddSupplierOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddSupplier}
              className="btn-primary"
            >
              Register Supplier
            </button>
          </>
        }
      >
        <form onSubmit={handleAddSupplier} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apex Packaging Solutions"
              value={newSupplierForm.name}
              onChange={(e) =>
                setNewSupplierForm({ ...newSupplierForm, name: e.target.value })
              }
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Procurement Contact Email *
              </label>
              <input
                type="email"
                required
                placeholder="procurement@supplier.com"
                value={newSupplierForm.email}
                onChange={(e) =>
                  setNewSupplierForm({ ...newSupplierForm, email: e.target.value })
                }
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                placeholder="+1 (555) 000-0000"
                value={newSupplierForm.phone}
                onChange={(e) =>
                  setNewSupplierForm({ ...newSupplierForm, phone: e.target.value })
                }
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Physical Warehouse / Depot Address
            </label>
            <input
              type="text"
              required
              placeholder="Facility address or logistics park"
              value={newSupplierForm.address}
              onChange={(e) =>
                setNewSupplierForm({ ...newSupplierForm, address: e.target.value })
              }
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Terms
              </label>
              <select
                value={newSupplierForm.paymentTerms}
                onChange={(e) =>
                  setNewSupplierForm({ ...newSupplierForm, paymentTerms: e.target.value })
                }
                className="form-input"
              >
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
                <option value="Advance on Dispatch">Advance on Dispatch</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Standard Lead Time (Days)
              </label>
              <input
                type="number"
                min="1"
                required
                value={newSupplierForm.leadTimeAvgDays}
                onChange={(e) =>
                  setNewSupplierForm({
                    ...newSupplierForm,
                    leadTimeAvgDays: Number(e.target.value),
                  })
                }
                className="form-input"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
