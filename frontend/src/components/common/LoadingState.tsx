import React from 'react';

interface LoadingStateProps {
  rows?: number;
  type?: 'table' | 'cards' | 'spinner';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  rows = 5,
  type = 'table',
}) => {
  if (type === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500 dark:text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent mb-3" />
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Synchronizing supply chain telemetry...</span>
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
            <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
            <div className="h-6 w-32 bg-slate-300 dark:bg-slate-700 rounded mb-2" />
            <div className="h-2 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 animate-pulse space-y-3">
      <div className="h-9 bg-slate-100 dark:bg-slate-800 rounded-lg w-full mb-4" />
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="flex items-center space-x-4 py-2 border-b border-slate-100 dark:border-slate-800 last:border-none">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        </div>
      ))}
    </div>
  );
};
