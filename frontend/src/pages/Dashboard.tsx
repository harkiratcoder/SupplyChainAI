import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  FileCheck,
  Building2,
  Package,
  Bot,
  Sparkles,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { ChartCard } from '../components/common/ChartCard';

const spendData = [
  { month: 'Apr', spend: 32400, budget: 40000 },
  { month: 'May', spend: 41200, budget: 40000 },
  { month: 'Jun', spend: 38900, budget: 42000 },
  { month: 'Jul', spend: 44100, budget: 45000 },
  { month: 'Aug', spend: 36800, budget: 45000 },
  { month: 'Sep (Proj)', spend: 28952, budget: 45000 },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const {
    inventory,
    purchaseOrders,
    recommendations,
    metrics,
    approvePurchaseOrder,
    createPurchaseOrderFromRecommendation
  } = useApp();

  const criticalAndHighItems = inventory.filter(
    (i) => i.risk === 'CRITICAL' || i.risk === 'HIGH'
  );

  const pendingOrders = purchaseOrders.filter((po) => po.status === 'PENDING_APPROVAL');

  // Distribution for Pie Chart
  const riskDistributionData = [
    { name: 'Critical (<3d)', value: inventory.filter((i) => i.risk === 'CRITICAL').length, color: '#e11d48' },
    { name: 'High (3-7d)', value: inventory.filter((i) => i.risk === 'HIGH').length, color: '#f59e0b' },
    { name: 'Moderate (7-14d)', value: inventory.filter((i) => i.risk === 'MEDIUM').length, color: '#3b82f6' },
    { name: 'Healthy (>14d)', value: inventory.filter((i) => i.risk === 'LOW').length, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Supply Chain Command Center"
        subtitle="Real-time stock runway analytics, autonomous supplier matching, and procurement actions."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/procurement')}
              className="btn-secondary text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Review AI Reorders ({recommendations.length})</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/ai-assistant')}
              className="btn-primary text-xs"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Open AI Copilot</span>
            </button>
          </div>
        }
      />

      {/* AI Intelligence Alert Banner */}
      <div className="rounded-xl border border-brand-200 dark:border-brand-900/50 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-blue-50/90 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 p-4 shadow-subtle">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-xs shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-900 dark:text-blue-400">
                  Autonomous Procurement Intelligence
                </h4>
                <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border dark:border-emerald-800/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                  Active Sentry
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-normal">
                AI identified <span className="font-semibold text-rose-700 dark:text-rose-400">{metrics.criticalRiskCount} critical stockouts</span> requiring immediate reorder. Preferred supplier quotes and optimal batch sizes have been pre-computed.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/procurement')}
            className="shrink-0 text-xs font-semibold text-brand-700 dark:text-blue-400 hover:text-brand-800 dark:hover:text-blue-300 flex items-center gap-1 hover:underline"
          >
            Review Recommendations ({recommendations.length}) &rarr;
          </button>
        </div>
      </div>

      {/* Primary KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Stock Runout Risks"
          value={metrics.criticalRiskCount + metrics.highRiskCount}
          subtitle={`${metrics.criticalRiskCount} critical (<3 days runway)`}
          icon={AlertTriangle}
          colorVariant="rose"
          badgeText="Urgent"
          trend={{
            value: '+2 new',
            positive: false,
            label: 'since yesterday',
          }}
          onClick={() => navigate('/inventory')}
        />

        <StatCard
          title="Pending Approvals"
          value={metrics.pendingApprovalsCount}
          subtitle={`$${metrics.totalPendingPoValue.toLocaleString()} awaiting sign-off`}
          icon={FileCheck}
          colorVariant="amber"
          badgeText="Human-in-loop"
          trend={{
            value: `${metrics.pendingApprovalsCount} POs`,
            neutral: true,
            label: 'in queue',
          }}
          onClick={() => navigate('/purchase-orders')}
        />

        <StatCard
          title="Active Suppliers"
          value={metrics.activeSuppliersCount}
          subtitle={`${metrics.avgSupplierOnTimeRate}% average on-time delivery`}
          icon={Building2}
          colorVariant="emerald"
          badgeText="Verified"
          trend={{
            value: '99.1%',
            positive: true,
            label: 'top vendor SLA',
          }}
          onClick={() => navigate('/suppliers')}
        />

        <StatCard
          title="Total Stock Units"
          value={metrics.totalStockUnits.toLocaleString()}
          subtitle={`Across ${metrics.totalSkus} monitored inventory SKUs`}
          icon={Package}
          colorVariant="blue"
          badgeText="Healthy"
          trend={{
            value: '100%',
            positive: true,
            label: 'audit coverage',
          }}
          onClick={() => navigate('/inventory')}
        />
      </div>

      {/* Main Grid: Charts & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Monthly Spend & Budget Trend */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Procurement Spend vs. Target Budget"
            subtitle="Historical monthly vendor commitments compared against quarterly budget ceilings."
            badge={<span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-medium">FY 2026</span>}
            action={
              <button
                onClick={() => navigate('/analytics')}
                className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
              >
                Deep Analytics <ExternalLink className="w-3 h-3" />
              </button>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderRadius: '8px',
                    border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                    color: isDark ? '#f8fafc' : '#1e293b',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="spend" name="Actual Spend" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#spendGradient)" />
                <Area type="monotone" dataKey="budget" name="Budget Ceiling" stroke={isDark ? '#475569' : '#94a3b8'} strokeDasharray="4 4" strokeWidth={1.5} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Stock Runway Risk Breakdown */}
        <div className="lg:col-span-1">
          <ChartCard
            title="Stock Runway Health"
            subtitle="Categorization of all catalog SKUs by days of operational runway."
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} SKUs`, name]}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderRadius: '8px',
                    border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                    color: isDark ? '#f8fafc' : '#1e293b',
                    fontSize: '12px'
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className={`text-[11px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Two Column Section: Urgent Reorder Queue vs Recent Purchase Orders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Critical Reorder Queue */}
        <div className="sc-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                Critical Reorder Queue
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Items breaching minimum safety buffers. Autonomous recommendation ready.
              </p>
            </div>
            <button
              onClick={() => navigate('/procurement')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              View All ({recommendations.length}) &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {criticalAndHighItems.slice(0, 4).map((item) => {
              const rec = recommendations.find((r) => r.product_id === item.product_id);
              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 hover:bg-slate-50 dark:bg-slate-850/60 dark:hover:bg-slate-800 transition-colors gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.product_name}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                        {item.sku}
                      </span>
                      <StatusBadge status={item.risk} size="sm" />
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      <span>
                        Current: <strong className="text-slate-800 dark:text-slate-200">{item.current_stock} {item.unit}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Runway: <strong className="text-rose-700 dark:text-rose-400">{item.days_remaining} days</strong>
                      </span>
                      <span>•</span>
                      <span>Daily Burn: {item.daily_usage} {item.unit}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {rec ? (
                      <button
                        type="button"
                        onClick={() => createPurchaseOrderFromRecommendation(rec)}
                        className="btn-primary text-xs py-1 px-2.5"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Order {rec.reorder_quantity} {item.unit}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => navigate('/inventory')}
                        className="btn-secondary text-xs py-1 px-2.5"
                      >
                        Inspect
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Purchase Orders Requiring Sign-off */}
        <div className="sc-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-amber-600" />
                Human-in-the-Loop Approvals
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Orders paused for human manager verification before transmission.
              </p>
            </div>
            <button
              onClick={() => navigate('/purchase-orders')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              Manage Orders &rarr;
            </button>
          </div>

          {pendingOrders.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 dark:bg-slate-850/40 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">All purchase orders approved!</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">No orders pending sign-off.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingOrders.slice(0, 4).map((po) => (
                <div
                  key={po.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850/60 dark:hover:bg-slate-800 transition-colors gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                        {po.po_number}
                      </span>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
                        • {po.supplier_name}
                      </span>
                      {po.isAiGenerated && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-brand-50 dark:bg-blue-950/50 text-brand-700 dark:text-blue-300 border border-brand-200 dark:border-blue-800/50">
                          AI Draft
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      <span>Total: <strong className="text-slate-900 dark:text-white font-semibold">${po.total_amount.toLocaleString()}</strong></span>
                      <span>•</span>
                      <span>Items: {po.items.length} SKU</span>
                      <span>•</span>
                      <span>Exp. Delivery: {po.expected_delivery}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/purchase-orders?view=${po.id}`)}
                      className="btn-secondary text-xs py-1 px-2"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => approvePurchaseOrder(po.id)}
                      className="btn-primary text-xs py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
