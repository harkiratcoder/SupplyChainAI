import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Plus,
  Bot,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../common/ThemeToggle';

interface TopNavbarProps {
  onMobileMenuToggle: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMobileMenuToggle }) => {
  const navigate = useNavigate();
  const { inventory, purchaseOrders, resetToDefaults, addToast } = useApp();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const criticalItems = inventory.filter((i) => i.risk === 'CRITICAL');
  const pendingOrders = purchaseOrders.filter((p) => p.status === 'PENDING_APPROVAL');
  const totalAlerts = criticalItems.length + pendingOrders.length;

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && quickSearch.trim()) {
      navigate(`/inventory?q=${encodeURIComponent(quickSearch.trim())}`);
      setQuickSearch('');
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#0b1120]/95 px-4 shadow-subtle dark:shadow-none backdrop-blur-md sm:gap-x-6 sm:px-6 lg:px-8 transition-colors">
      {/* Mobile hamburger */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-slate-700 dark:text-slate-200 lg:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        onClick={onMobileMenuToggle}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>

      {/* Global Quick Search */}
      <div className="flex flex-1 items-center gap-x-4">
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Quick search SKUs, suppliers, POs... (Press Enter)"
            className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900 py-1.5 pl-9 pr-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-brand-600 dark:focus:border-brand-500 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-1 focus:ring-brand-600 transition-colors"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-x-2 sm:gap-x-3">
        {/* Ask AI Agent pill button */}
        <button
          type="button"
          onClick={() => navigate('/ai-assistant')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 border border-brand-200/90 dark:border-brand-800/80 rounded-lg transition-colors shadow-xs"
        >
          <Bot className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span className="hidden md:inline">AI Copilot</span>
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </button>

        {/* Quick PO Creation */}
        <button
          type="button"
          onClick={() => navigate('/purchase-orders')}
          className="btn-primary text-xs py-1.5 px-3 hidden sm:inline-flex"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New PO</span>
        </button>

        {/* Theme Toggle (Sun & Moon) */}
        <ThemeToggle />

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            title="Operational Alerts"
          >
            <Bell className="h-5 w-5" />
            {totalAlerts > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                {totalAlerts}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 z-30 mt-2 w-80 sm:w-96 origin-top-right rounded-xl bg-white dark:bg-slate-900 p-4 shadow-dropdown dark:shadow-2xl ring-1 ring-black ring-opacity-5 border border-slate-200 dark:border-slate-800 focus:outline-none">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-2">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Operational Alerts
                  </h4>
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-semibold border border-rose-200/50 dark:border-rose-900/60">
                    {totalAlerts} Active
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/procurement');
                    setNotificationOpen(false);
                  }}
                  className="text-[11px] font-medium text-brand-600 dark:text-brand-400 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {criticalItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      navigate('/procurement');
                      setNotificationOpen(false);
                    }}
                    className="flex items-start gap-2.5 p-2 rounded-lg bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-100 dark:border-rose-900/50 cursor-pointer transition-colors"
                  >
                    <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        Critical Stockout: {item.product_name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Only {item.current_stock} {item.unit} left (~{item.days_remaining} days runway).
                      </p>
                    </div>
                  </div>
                ))}

                {pendingOrders.map((po) => (
                  <div
                    key={po.id}
                    onClick={() => {
                      navigate('/purchase-orders');
                      setNotificationOpen(false);
                    }}
                    className="flex items-start gap-2.5 p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/30 hover:bg-amber-50 dark:hover:bg-amber-950/50 border border-amber-100 dark:border-amber-900/50 cursor-pointer transition-colors"
                  >
                    <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        Approval Required: {po.po_number}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {po.supplier_name} • ${po.total_amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar and Menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-slate-900 dark:bg-brand-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              JD
            </div>
            <div className="hidden text-left xl:block">
              <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">
                Julian Drake
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Head of Procurement
              </span>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 z-30 mt-2 w-56 origin-top-right rounded-xl bg-white dark:bg-slate-900 p-1.5 shadow-dropdown dark:shadow-2xl ring-1 ring-black ring-opacity-5 border border-slate-200 dark:border-slate-800 focus:outline-none">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Acme Global Foods</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">julian.drake@acmefoods.com</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigate('/settings');
                  setProfileOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Workspace Settings
              </button>

              <button
                type="button"
                onClick={() => {
                  resetToDefaults();
                  setProfileOpen(false);
                  addToast('Workspace Reset', 'Demo database restored to default factory state.', 'info');
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Reset Demo Data
              </button>

              <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/login');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
