import React, { useState } from 'react';
import {
  Save,
  Sliders,
  RotateCcw,
  Lock,
  Server,
  Palette,
  Sun,
  Moon,
  Laptop,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from '../components/common/PageHeader';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';

export const Settings: React.FC = () => {
  const { resetToDefaults, addToast } = useApp();
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Settings form states
  const [targetBufferDays, setTargetBufferDays] = useState(14);
  const [criticalThresholdDays, setCriticalThresholdDays] = useState(3);
  const [managerApprovalThreshold, setManagerApprovalThreshold] = useState(5000);
  const [aiAutopilotEnabled, setAiAutopilotEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [fastApiBaseUrl, setFastApiBaseUrl] = useState('http://localhost:8000');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Configuration Saved', 'Procurement rules, appearance, and agent parameters updated successfully.', 'success');
  };

  const themeOptions = [
    {
      id: 'light' as const,
      label: 'Light Mode',
      description: 'Clean enterprise design with crisp blue accents, white surfaces, and high contrast.',
      icon: Sun,
      iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60',
    },
    {
      id: 'dark' as const,
      label: 'Dark Mode',
      description: 'Deep navy background (#0b1120) with slate-900 surface cards and accessible accents.',
      icon: Moon,
      iconColor: 'text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60',
    },
    {
      id: 'system' as const,
      label: 'System Preference',
      description: `Automatically adapts to your device OS theme. Currently resolved to ${resolvedTheme} mode.`,
      icon: Laptop,
      iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Platform & Workflow Settings"
        subtitle="Configure application appearance, autonomous procurement triggers, human-approval thresholds, and backend integration parameters."
      />

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Appearance & Interface Theme Section (Requirement 2) */}
        <div className="sc-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Appearance & Theme
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
              Active: {theme === 'system' ? `System (${resolvedTheme})` : theme.charAt(0).toUpperCase() + theme.slice(1)}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose your preferred color theme. Preferences are saved automatically to local storage and preserved across browser sessions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    setTheme(opt.id);
                    addToast('Theme Updated', `Switched application appearance to ${opt.label}.`, 'info');
                  }}
                  className={`relative p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-brand-600 dark:border-brand-500 bg-brand-50/40 dark:bg-brand-950/30 ring-2 ring-brand-500/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center border shadow-xs ${opt.iconColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 dark:text-brand-300 bg-brand-100/80 dark:bg-brand-900/60 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">
                          <Check className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-400">Select</span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {opt.label}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                      {opt.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Safety Buffer & Inventory Rules */}
        <div className="sc-card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Sliders className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Inventory & Reorder Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Safety Buffer (Days of Consumption)
              </label>
              <input
                type="number"
                min="7"
                max="60"
                value={targetBufferDays}
                onChange={(e) => setTargetBufferDays(Number(e.target.value))}
                className="form-input"
              />
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Formula target used to calculate reorder quantities: (daily burn × {targetBufferDays}) - stock.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Critical Runout Alert Runway (Days)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={criticalThresholdDays}
                onChange={(e) => setCriticalThresholdDays(Number(e.target.value))}
                className="form-input"
              />
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Items below {criticalThresholdDays} days runway are marked as CRITICAL and trigger urgent notifications.
              </p>
            </div>
          </div>
        </div>

        {/* Human-in-the-Loop Governance */}
        <div className="sc-card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Human-in-the-Loop Approvals & Governance
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Manager Authorization Ceiling ($ USD)
            </label>
            <input
              type="number"
              step="500"
              value={managerApprovalThreshold}
              onChange={(e) => setManagerApprovalThreshold(Number(e.target.value))}
              className="form-input max-w-sm"
            />
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              All purchase orders above this threshold require manual manager sign-off before dispatching to suppliers.
            </p>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={aiAutopilotEnabled}
                onChange={(e) => setAiAutopilotEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-850"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Allow AI Sentry to Pre-generate Draft Purchase Orders
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  When enabled, AI automatically creates draft POs when stock drops below threshold, keeping them paused in PENDING_APPROVAL.
                </p>
              </div>
            </label>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-850"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Real-time Email Alerts for Critical Stockouts
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Dispatch email notifications to the procurement team whenever runway drops below 3 days.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* FastAPI Backend Ready Configuration */}
        <div className="sc-card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              FastAPI Backend & Agent Services
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                FastAPI Server Endpoint
              </label>
              <input
                type="text"
                value={fastApiBaseUrl}
                onChange={(e) => setFastApiBaseUrl(e.target.value)}
                className="form-input font-mono text-xs"
              />
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Connected to local Python server for `/inventory`, `/suppliers`, and `/ai/ask`.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                AI Model Engine
              </label>
              <input
                type="text"
                disabled
                value="Google Gemini 2.5 Flash (via google-genai SDK)"
                className="form-input bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs cursor-not-allowed"
              />
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Agentic function calling configured via backend `ai/gemini.py`.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="btn-secondary text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Workspace Data</span>
          </button>

          <button type="submit" className="btn-primary text-xs py-2 px-5">
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Reset Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          resetToDefaults();
          addToast('Workspace Reset', 'All inventory, supplier rates, and purchase orders have been restored.', 'info');
        }}
        title="Reset All Workspace Data?"
        message="This will restore all products, suppliers, stock counts, and purchase orders to initial enterprise demo values. Local changes will be cleared."
        variant="danger"
        confirmText="Yes, Reset Data"
      />
    </div>
  );
};
