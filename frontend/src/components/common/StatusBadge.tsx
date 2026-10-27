import React from 'react';
import type { RiskLevel, PurchaseOrderStatus } from '../../types';
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Truck, PackageCheck, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: RiskLevel | PurchaseOrderStatus | string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  // Risk badges
  if (status === 'CRITICAL') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60 ${sizeClasses}`}>
        {showIcon && <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 animate-pulse" />}
        Critical Risk
      </span>
    );
  }

  if (status === 'HIGH') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60 ${sizeClasses}`}>
        {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
        High Risk
      </span>
    );
  }

  if (status === 'MEDIUM') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60 ${sizeClasses}`}>
        {showIcon && <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
        Moderate Buffer
      </span>
    );
  }

  if (status === 'LOW') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900/60 ${sizeClasses}`}>
        {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
        Healthy Stock
      </span>
    );
  }

  // Purchase Order Badges
  if (status === 'PENDING_APPROVAL') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-900/60 ${sizeClasses}`}>
        {showIcon && <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
        Pending Approval
      </span>
    );
  }

  if (status === 'APPROVED') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60 ${sizeClasses}`}>
        {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
        Approved
      </span>
    );
  }

  if (status === 'SENT') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-900/60 ${sizeClasses}`}>
        {showIcon && <Truck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
        Sent to Supplier
      </span>
    );
  }

  if (status === 'RECEIVED') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900/60 ${sizeClasses}`}>
        {showIcon && <PackageCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
        Received & Stored
      </span>
    );
  }

  if (status === 'CANCELLED') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 ${sizeClasses}`}>
        {showIcon && <XCircle className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
        Cancelled
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 ${sizeClasses}`}>
      {status}
    </span>
  );
};
