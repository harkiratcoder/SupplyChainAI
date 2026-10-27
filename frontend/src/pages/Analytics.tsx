import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  DollarSign,
  Clock,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { ChartCard } from '../components/common/ChartCard';

const spendAndSavings = [
  { month: 'Jan', spend: 28000, savings: 3200 },
  { month: 'Feb', spend: 31000, savings: 4100 },
  { month: 'Mar', spend: 35000, savings: 4800 },
  { month: 'Apr', spend: 32400, savings: 5200 },
  { month: 'May', spend: 41200, savings: 6300 },
  { month: 'Jun', spend: 38900, savings: 5900 },
  { month: 'Jul', spend: 44100, savings: 7100 },
  { month: 'Aug', spend: 36800, savings: 6400 },
  { month: 'Sep (MTD)', spend: 28952, savings: 4900 },
];

const categoryValuation = [
  { category: 'Food & Grains', value: 48200, items: 3 },
  { category: 'Sanitation & PPE', value: 12400, items: 2 },
  { category: 'Beverage', value: 9800, items: 1 },
  { category: 'Packaging', value: 14500, items: 1 },
  { category: 'Industrial Gas', value: 8900, items: 1 },
];

const stockoutTrend = [
  { week: 'W32', incidents: 5, resolvedByAI: 4 },
  { week: 'W33', incidents: 6, resolvedByAI: 5 },
  { week: 'W34', incidents: 4, resolvedByAI: 4 },
  { week: 'W35', incidents: 3, resolvedByAI: 3 },
  { week: 'W36', incidents: 4, resolvedByAI: 4 },
  { week: 'W37 (Current)', incidents: 2, resolvedByAI: 2 },
];

export const Analytics: React.FC = () => {
  const { suppliers } = useApp();

  const supplierLeadTimes = suppliers.map((s) => ({
    name: s.name.split(' ')[0],
    leadDays: s.leadTimeAvgDays,
    onTimeRate: s.onTimeDeliveryRate,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supply Chain Analytics & Intelligence"
        subtitle="Operational efficiency metrics, vendor fulfillment benchmarks, and automated cost avoidance."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Reporting Range:</span>
            <select className="form-input text-xs py-1.5 px-3 bg-white">
              <option>Year to Date (2026)</option>
              <option>Last 90 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total SCM Spend (YTD)"
          value="$296,352"
          subtitle="Within 4.2% of annual budget"
          icon={DollarSign}
          colorVariant="blue"
          trend={{ value: '-3.1%', positive: true, label: 'cost reduction' }}
        />

        <StatCard
          title="AI Sourcing Savings"
          value="$47,900"
          subtitle="Achieved via quote optimization"
          icon={Sparkles}
          colorVariant="emerald"
          trend={{ value: '+18.4%', positive: true, label: 'vs last year' }}
        />

        <StatCard
          title="Average Fulfillment Time"
          value="3.2 Days"
          subtitle="Across all active tier-1 vendors"
          icon={Clock}
          colorVariant="indigo"
          trend={{ value: '-0.8d', positive: true, label: 'speed improvement' }}
        />

        <StatCard
          title="Stockout Prevention Rate"
          value="99.4%"
          subtitle="Critical lines maintained"
          icon={ShieldCheck}
          colorVariant="amber"
          trend={{ value: '100%', positive: true, label: 'uptime this week' }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spend & AI Cost Avoidance */}
        <ChartCard
          title="Monthly Spend vs. AI Cost Avoidance"
          subtitle="Direct savings captured by matching lowest-rate contracted suppliers."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spendAndSavings} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${val / 1000}k`}
              />
              <Tooltip
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Legend
                verticalAlign="top"
                height={30}
                iconType="circle"
                formatter={(val) => <span className="text-xs text-slate-600">{val}</span>}
              />
              <Bar dataKey="spend" name="Actual Invoiced Spend" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="savings" name="AI Price Arbitrage Savings" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Vendor On-Time Delivery Benchmark */}
        <ChartCard
          title="Supplier SLA Benchmark (On-Time Delivery %)"
          subtitle="Contractual performance tracking across verified supplier partners."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={supplierLeadTimes} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <YAxis
                domain={[85, 100]}
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                formatter={(value: any) => [`${value}% On-Time`, 'Delivery SLA']}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Bar dataKey="onTimeRate" name="On-Time Delivery %" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Category Inventory Valuation */}
        <ChartCard
          title="Inventory Valuation by Category"
          subtitle="Total asset capitalization held across active warehouse zones."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={categoryValuation} margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${val / 1000}k`}
              />
              <YAxis
                dataKey="category"
                type="category"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Valuation']}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Bar dataKey="value" name="Valuation ($)" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Stockout Threat Frequency */}
        <ChartCard
          title="Stockout Threat Mitigation Trend"
          subtitle="Weekly count of inventory items dipping below buffer and automated remedies."
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stockoutTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Legend
                verticalAlign="top"
                height={30}
                iconType="circle"
                formatter={(val) => <span className="text-xs text-slate-600">{val}</span>}
              />
              <Line
                type="monotone"
                dataKey="incidents"
                name="Stockout Alerts"
                stroke="#f43f5e"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="resolvedByAI"
                name="Resolved by AI Reorders"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};
