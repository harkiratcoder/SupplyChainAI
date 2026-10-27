import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
            case 'error':
              return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
            default:
              return <Info className="w-5 h-5 text-brand-500 shrink-0" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'success':
              return 'border-emerald-200 dark:border-emerald-800/80';
            case 'warning':
              return 'border-amber-200 dark:border-amber-800/80';
            case 'error':
              return 'border-rose-200 dark:border-rose-800/80';
            default:
              return 'border-brand-200 dark:border-brand-800/80';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 bg-white dark:bg-slate-900 rounded-xl shadow-lg dark:shadow-2xl border ${getBorderColor()} transition-all duration-200 transform translate-y-0`}
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{toast.title}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">{toast.message}</p>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">{toast.timestamp}</span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
