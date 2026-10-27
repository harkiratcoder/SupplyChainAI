import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  SlidersHorizontal,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { SearchBar } from '../components/common/SearchBar';
import { FilterDropdown } from '../components/common/FilterDropdown';
import type { FilterOption } from '../components/common/FilterDropdown';
import { StatusBadge } from '../components/common/StatusBadge';
import { DataTable } from '../components/common/DataTable';
import type { Column } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import type { InventoryItem } from '../types';

export const Inventory: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { inventory, updateInventoryStock, addProduct, recommendations, createPurchaseOrderFromRecommendation } = useApp();

  // URL state query
  const queryParam = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modals state
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedItemForAdjust, setSelectedItemForAdjust] = useState<InventoryItem | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    sku: '',
    category: 'Food & Grains',
    unit: 'kg',
    description: '',
    initialStock: 100,
    reorderLevel: 80,
    dailyUsage: 10,
  });

  // Extract distinct categories
  const categories = useMemo(() => {
    const set = new Set(inventory.map((item) => item.category));
    const opts: FilterOption[] = [{ label: 'All Categories', value: 'ALL' }];
    set.forEach((cat) => opts.push({ label: cat, value: cat }));
    return opts;
  }, [inventory]);

  const riskOptions: FilterOption[] = [
    { label: 'All Risks', value: 'ALL' },
    { label: 'Critical (<3d)', value: 'CRITICAL' },
    { label: 'High (3-7d)', value: 'HIGH' },
    { label: 'Moderate (7-14d)', value: 'MEDIUM' },
    { label: 'Healthy (>14d)', value: 'LOW' },
  ];

  // Filtered data
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRisk = selectedRisk === 'ALL' || item.risk === selectedRisk;
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;

      return matchesSearch && matchesRisk && matchesCategory;
    });
  }, [inventory, searchQuery, selectedRisk, selectedCategory]);

  const handleOpenAdjust = (item: InventoryItem) => {
    setSelectedItemForAdjust(item);
    setNewStockValue(item.current_stock);
    setIsAdjustModalOpen(true);
  };

  const handleSaveStockAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItemForAdjust) {
      updateInventoryStock(selectedItemForAdjust.product_id, Number(newStockValue));
      setIsAdjustModalOpen(false);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(
      {
        name: newProductForm.name,
        sku: newProductForm.sku,
        category: newProductForm.category,
        unit: newProductForm.unit,
        description: newProductForm.description,
      },
      Number(newProductForm.initialStock),
      Number(newProductForm.reorderLevel),
      Number(newProductForm.dailyUsage)
    );
    setIsAddProductOpen(false);
    setNewProductForm({
      name: '',
      sku: '',
      category: 'Food & Grains',
      unit: 'kg',
      description: '',
      initialStock: 100,
      reorderLevel: 80,
      dailyUsage: 10,
    });
  };

  // Columns definition for DataTable
  const columns: Column<InventoryItem>[] = [
    {
      header: 'Product / SKU',
      accessorKey: 'product_name',
      sortable: true,
      cell: (item) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{item.product_name}</div>
          <div className="font-mono text-xs text-slate-400 dark:text-slate-500 mt-0.5">{item.sku}</div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
      sortable: true,
      cell: (item) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {item.category}
        </span>
      ),
    },
    {
      header: 'Current Stock',
      accessorKey: 'current_stock',
      sortable: true,
      cell: (item) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white text-sm">
            {item.current_stock.toLocaleString()}
          </span>{' '}
          <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">{item.unit}</span>
          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            Reorder at: {item.reorder_level} {item.unit}
          </div>
        </div>
      ),
    },
    {
      header: 'Daily Burn Rate',
      accessorKey: 'daily_usage',
      sortable: true,
      cell: (item) => (
        <div className="text-xs text-slate-700 dark:text-slate-300">
          <span className="font-medium">{item.daily_usage}</span> {item.unit}/day
        </div>
      ),
    },
    {
      header: 'Runway / Days Left',
      accessorKey: 'days_remaining',
      sortable: true,
      cell: (item) => {
        const days = item.days_remaining;
        const percent = Math.min(100, Math.max(5, (days ? days / 30 : 0) * 100));

        let barColor = 'bg-emerald-500';
        if (days !== null && days < 3) barColor = 'bg-rose-500';
        else if (days !== null && days < 7) barColor = 'bg-amber-500';
        else if (days !== null && days <= 14) barColor = 'bg-blue-500';

        return (
          <div className="w-36">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-900 dark:text-white">
                {days !== null ? `${days} days` : 'N/A'}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                {days !== null ? `${Math.round(percent)}% buffer` : ''}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${barColor}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: 'Stock Status',
      accessorKey: 'risk',
      sortable: true,
      cell: (item) => <StatusBadge status={item.risk} size="sm" />,
    },
    {
      header: 'Location',
      accessorKey: 'location',
      cell: (item) => (
        <span className="text-xs text-slate-500 dark:text-slate-400 truncate block max-w-[140px]">
          {item.location || 'Central Vault'}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      cell: (item) => {
        const rec = recommendations.find((r) => r.product_id === item.product_id);

        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => handleOpenAdjust(item)}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              title="Adjust Physical Stock"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            {rec ? (
              <button
                type="button"
                onClick={() => createPurchaseOrderFromRecommendation(rec)}
                className="btn-primary text-xs py-1 px-2.5"
                title="Trigger AI Restock Order"
              >
                <Sparkles className="w-3 h-3" />
                <span>Restock</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleOpenAdjust(item)}
                className="btn-secondary text-xs py-1 px-2 text-slate-600 dark:text-slate-300"
              >
                Edit
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Intelligence"
        subtitle="Live catalog telemetry, burn rate calculation, and safety buffer forecasting."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddProductOpen(true)}
              className="btn-primary text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add SKU</span>
            </button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="sc-card p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              if (val) setSearchParams({ q: val });
              else setSearchParams({});
            }}
            placeholder="Search by SKU, product name, or category..."
          />

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap justify-end">
            <FilterDropdown
              label="Risk"
              options={riskOptions}
              selectedValue={selectedRisk}
              onChange={setSelectedRisk}
            />
            <FilterDropdown
              label="Category"
              options={categories}
              selectedValue={selectedCategory}
              onChange={setSelectedCategory}
            />
            {(searchQuery || selectedRisk !== 'ALL' || selectedCategory !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRisk('ALL');
                  setSelectedCategory('ALL');
                  setSearchParams({});
                }}
                className="btn-ghost text-xs text-slate-500 py-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <DataTable
        columns={columns}
        data={filteredInventory}
        keyExtractor={(item) => item.id}
        pageSize={10}
        emptyTitle="No inventory matches found"
        emptyDescription="Try adjusting your search query or reset the risk and category filters."
      />

      {/* Adjust Stock Modal */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title={`Adjust Stock: ${selectedItemForAdjust?.product_name}`}
        subtitle={`SKU: ${selectedItemForAdjust?.sku} • Unit: ${selectedItemForAdjust?.unit}`}
        maxWidth="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAdjustModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveStockAdjust}
              className="btn-primary"
            >
              Update Stock Level
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveStockAdjust} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Current Physical Stock ({selectedItemForAdjust?.unit})
            </label>
            <input
              type="number"
              min="0"
              step="any"
              required
              value={newStockValue}
              onChange={(e) => setNewStockValue(Number(e.target.value))}
              className="form-input text-base font-semibold"
            />
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Daily burn rate is{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {selectedItemForAdjust?.daily_usage} {selectedItemForAdjust?.unit}/day
              </strong>
              . Safety buffer reorder trigger is{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {selectedItemForAdjust?.reorder_level} {selectedItemForAdjust?.unit}
              </strong>
              .
            </p>
          </div>

          <div className="rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-3 text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
            Updating the stock count will dynamically recalculate the days-to-stockout runway and refresh any AI procurement recommendations across all dashboards.
          </div>
        </form>
      </Modal>

      {/* Add SKU Modal */}
      <Modal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        title="Add New Inventory SKU"
        subtitle="Enroll a new product into autonomous inventory monitoring and replenishment."
        maxWidth="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAddProductOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateProduct}
              className="btn-primary"
            >
              Add Product to Catalog
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Industrial Food Wrap 500m"
                value={newProductForm.name}
                onChange={(e) =>
                  setNewProductForm({ ...newProductForm, name: e.target.value })
                }
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                SKU Identifier *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. WRP-009"
                value={newProductForm.sku}
                onChange={(e) =>
                  setNewProductForm({ ...newProductForm, sku: e.target.value })
                }
                className="form-input font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={newProductForm.category}
                onChange={(e) =>
                  setNewProductForm({ ...newProductForm, category: e.target.value })
                }
                className="form-input"
              >
                <option value="Food & Grains">Food & Grains</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Beverage">Beverage</option>
                <option value="Packaging">Packaging</option>
                <option value="Industrial Gas">Industrial Gas</option>
                <option value="Raw Materials">Raw Materials</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Measurement Unit
              </label>
              <input
                type="text"
                required
                placeholder="e.g. kg, litre, box, cylinder"
                value={newProductForm.unit}
                onChange={(e) =>
                  setNewProductForm({ ...newProductForm, unit: e.target.value })
                }
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Initial Stock
              </label>
              <input
                type="number"
                min="0"
                required
                value={newProductForm.initialStock}
                onChange={(e) =>
                  setNewProductForm({ ...newProductForm, initialStock: Number(e.target.value) })
                }
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reorder Threshold
              </label>
              <input
                type="number"
                min="0"
                required
                value={newProductForm.reorderLevel}
                onChange={(e) =>
                  setNewProductForm({ ...newProductForm, reorderLevel: Number(e.target.value) })
                }
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Daily Usage
              </label>
              <input
                type="number"
                min="0.1"
                step="any"
                required
                value={newProductForm.dailyUsage}
                onChange={(e) =>
                  setNewProductForm({ ...newProductForm, dailyUsage: Number(e.target.value) })
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
