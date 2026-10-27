import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive?: boolean;
    neutral?: boolean;
    label?: string;
  };
  colorVariant?: 'blue' | 'rose' | 'amber' | 'emerald' | 'indigo' | 'slate';
  badgeText?: string;
  onClick?: () => void;
}

const colorStyles = {
  blue: {
    iconBg: 'bg-blue-50 dark:bg-blue-950/60 text-brand-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/60',
    hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-700',
  },
  rose: {
    iconBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/60',
    hoverBorder: 'hover:border-rose-300 dark:hover:border-rose-700',
  },
  amber: {
    iconBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/60',
    hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
  },
  emerald: {
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/60',
    hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700',
  },
  indigo: {
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/60',
    hoverBorder: 'hover:border-indigo-300 dark:hover:border-indigo-700',
  },
  slate: {
    iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    hoverBorder: 'hover:border-slate-300 dark:hover:border-slate-600',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorVariant = 'blue',
  badgeText,
  onClick,
}) => {
  const styles = colorStyles[colorVariant];

  return (
    <div
      onClick={onClick}
      className={`sc-card p-5 ${styles.hoverBorder} ${
        onClick ? 'cursor-pointer hover:shadow-card-hover' : ''
      } transition-all duration-150 flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {title}
            </span>
            {badgeText && (
              <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border border-slate-200/50 dark:border-slate-700">
                {badgeText}
              </span>
            )}
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </div>
        </div>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-xs ${styles.iconBg}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          {trend ? (
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className={`inline-flex items-center gap-0.5 ${
                  trend.neutral
                    ? 'text-slate-600 dark:text-slate-400'
                    : trend.positive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {trend.positive ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {trend.value}
              </span>
              {trend.label && <span className="text-slate-400 dark:text-slate-500 font-normal">{trend.label}</span>}
            </div>
          ) : (
            <span className="text-slate-500 dark:text-slate-400 truncate">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};
