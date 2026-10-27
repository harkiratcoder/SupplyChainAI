import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  Users,
  Sparkles,
  FileCheck2,
  Bot,
  BarChart3,
  Settings,
  X,
  Layers,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { metrics, recommendations } = useApp();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    {
      name: 'Inventory',
      href: '/inventory',
      icon: Boxes,
      badge: metrics.criticalRiskCount > 0 ? `${metrics.criticalRiskCount} critical` : undefined,
      badgeColor: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/50 dark:border-rose-900/50',
    },
    { name: 'Suppliers', href: '/suppliers', icon: Users },
    {
      name: 'Procurement',
      href: '/procurement',
      icon: Sparkles,
      badge: recommendations.length > 0 ? `${recommendations.length} new` : undefined,
      badgeColor: 'bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/50 dark:border-brand-900/50',
    },
    {
      name: 'Purchase Orders',
      href: '/purchase-orders',
      icon: FileCheck2,
      badge: metrics.pendingApprovalsCount > 0 ? `${metrics.pendingApprovalsCount} pending` : undefined,
      badgeColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-900/50',
    },
    {
      name: 'AI Assistant',
      href: '/ai-assistant',
      icon: Bot,
      highlight: true,
      badge: 'Agentic',
      badgeColor: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs',
    },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white dark:bg-[#0d1527] border-r border-slate-200 dark:border-slate-800 transition-colors">
      <div>
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200/80 dark:border-slate-800">
          <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-xs group-hover:bg-brand-700 transition-colors">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                SupplyChain<span className="text-brand-600 dark:text-brand-400">AI</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block -mt-1">
                Autonomous SCM
              </span>
            </div>
          </NavLink>
          {/* Mobile close */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Facility / Warehouse Switcher */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60">
          <button
            type="button"
            className="w-full flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 shadow-subtle dark:shadow-none text-left transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">Central Distribution Hub</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">Delhi Metro Node-01</p>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-1" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="mt-3 px-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive
                            ? 'text-brand-600 dark:text-brand-400'
                            : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Agent Status card */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 p-3 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Agent Sentry</span>
            </div>
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
              v2.5
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            Inventory runway scan active. Autonomous lead time checks armed.
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-750 flex items-center justify-between text-[11px] font-medium text-brand-600 dark:text-brand-400">
            <NavLink to="/ai-assistant" className="hover:underline flex items-center gap-1">
              Ask Copilot &rarr;
            </NavLink>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 max-w-full shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
