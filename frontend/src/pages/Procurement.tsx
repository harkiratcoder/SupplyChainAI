import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import type { ProcurementRecommendation } from '../types';

export const Procurement: React.FC = () => {
  const navigate = useNavigate();
  const { recommendations, createPurchaseOrderFromRecommendation, addToast } = useApp();

  const handleCreateOrder = (rec: ProcurementRecommendation) => {
    const po = createPurchaseOrderFromRecommendation(rec);
    navigate(`/purchase-orders?view=${po.id}`);
  };

  const handleGenerateAll = () => {
    recommendations.forEach((rec) => {
      createPurchaseOrderFromRecommendation(rec);
    });
    addToast('Bulk Purchase Orders Drafted', `Generated ${recommendations.length} purchase orders ready for human verification.`, 'success');
    navigate('/purchase-orders');
  };

  const totalEstimatedSpend = recommendations.reduce((acc, curr) => acc + curr.estimated_cost, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Procurement Recommendations"
        subtitle="Automated stockout forecasting, multi-supplier cost comparison, and optimal order quantity modeling."
        actions={
          recommendations.length > 0 ? (
            <button
              type="button"
              onClick={handleGenerateAll}
              className="btn-primary text-xs"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Draft All {recommendations.length} Reorders (${totalEstimatedSpend.toLocaleString()})</span>
            </button>
          ) : undefined
        }
      />

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sc-card p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Pending Restock Actions
            </span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {recommendations.length} SKUs
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-brand-600 dark:text-blue-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="sc-card p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Estimated Procurement Cost
            </span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              ${totalEstimatedSpend.toLocaleString()}
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="sc-card p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Target Safety Runway
            </span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              14 Days Buffer
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="sc-card p-12 text-center bg-white dark:bg-slate-900">
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">All Inventory Runways Healthy</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            No stock levels are currently at or below reorder buffer targets. The autonomous agent is actively monitoring burn rates.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.product_id}
              className="sc-card p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all border-l-4 border-l-brand-600"
            >
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-sm shrink-0">
                    {rec.sku.substring(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {rec.product_name}
                      </h3>
                      <span className="font-mono text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {rec.sku}
                      </span>
                      <StatusBadge status={rec.risk} size="sm" />
                      <span className="text-[11px] font-semibold text-brand-700 dark:text-blue-300 bg-brand-50 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-brand-200 dark:border-blue-800/50">
                        {rec.confidence_score}% AI Match Confidence
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex-wrap">
                      <span>
                        Current Stock: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{rec.current_stock} {rec.unit}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Runway: <strong className="text-rose-700 dark:text-rose-400 font-bold">{rec.days_remaining} days left</strong>
                      </span>
                      <span>•</span>
                      <span>Daily Burn: {rec.daily_usage} {rec.unit}/day</span>
                      <span>•</span>
                      <span>Category: {rec.category}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500 block">
                      Estimated PO Value
                    </span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      ${rec.estimated_cost.toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCreateOrder(rec)}
                    className="btn-primary text-xs py-2 px-3.5 bg-brand-600 hover:bg-brand-700"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Create Draft PO</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* AI Justification & Supplier Quote Matrix */}
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* AI Reasoning box */}
                <div className="lg:col-span-1 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 p-3.5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-blue-400" />
                      Agent Reasoning
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {rec.reasoning}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Formula: (14d × burn) - stock</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Target: {rec.reorder_quantity} {rec.unit}
                    </span>
                  </div>
                </div>

                {/* Sourcing Comparison Matrix */}
                <div className="lg:col-span-2 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                    <thead className="bg-slate-50/70 dark:bg-slate-850 font-semibold text-slate-600 dark:text-slate-300">
                      <tr>
                        <th className="px-3 py-2 text-left">Supplier</th>
                        <th className="px-3 py-2 text-right">Contracted Price</th>
                        <th className="px-3 py-2 text-right">Lead Time</th>
                        <th className="px-3 py-2 text-right">MOQ</th>
                        <th className="px-3 py-2 text-right">Total Est.</th>
                        <th className="px-3 py-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
                      {rec.suppliers.map((s) => {
                        const isRecommended = s.supplier_id === rec.recommended_supplier_id;
                        const itemEstCost = rec.reorder_quantity * s.price;

                        return (
                          <tr
                            key={s.supplier_id}
                            className={isRecommended ? 'bg-blue-50/40 dark:bg-blue-950/30 font-medium' : 'hover:bg-slate-50 dark:hover:bg-slate-850/60'}
                          >
                            <td className="px-3 py-2 text-slate-900 dark:text-white">
                              <div className="flex items-center gap-1.5">
                                <span>{s.supplier_name}</span>
                                {isRecommended && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-brand-600 text-white">
                                    Recommended
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-right font-mono text-slate-800 dark:text-slate-200">
                              ${s.price.toFixed(2)}/{rec.unit}
                            </td>
                            <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-300">
                              {s.lead_time_days} days
                            </td>
                            <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-300">
                              {s.minimum_order_quantity} {rec.unit}
                            </td>
                            <td className="px-3 py-2 text-right font-bold text-slate-900 dark:text-white">
                              ${itemEstCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="px-3 py-2 text-center">
                              {isRecommended ? (
                                <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                  Lowest Cost SLA
                                </span>
                              ) : (
                                <span className="text-slate-400 dark:text-slate-500 text-[11px]">Backup</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
