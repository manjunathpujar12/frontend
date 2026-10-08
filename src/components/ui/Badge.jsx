import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, Clock, XCircle, Info } from 'lucide-react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const baseClasses = 'inline-flex items-center gap-1.5 font-medium rounded-full border transition-all';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  }[size] || 'px-2.5 py-1 text-xs';

  const variantClasses = {
    // Budget Health Badges
    normal: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    critical: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    overspent: 'bg-red-600/25 text-red-300 border-red-500/50 shadow-sm shadow-red-900/50 animate-pulse',

    // Status Badges
    approved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    rejected: 'bg-red-500/15 text-red-300 border-red-500/30',
    
    // General
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    primary: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  }[variant] || 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <span className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  switch (status?.toUpperCase()) {
    case 'APPROVED':
      return (
        <Badge variant="approved">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Approved</span>
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge variant="pending">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Pending Review</span>
        </Badge>
      );
    case 'REJECTED':
      return (
        <Badge variant="rejected">
          <XCircle className="w-3.5 h-3.5 text-red-400" />
          <span>Rejected</span>
        </Badge>
      );
    case 'OVERSPENT':
      return (
        <Badge variant="overspent">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          <span>Overspent</span>
        </Badge>
      );
    case 'CRITICAL':
      return (
        <Badge variant="critical">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>Critical</span>
        </Badge>
      );
    case 'WARNING':
      return (
        <Badge variant="warning">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          <span>Warning</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="normal">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Healthy</span>
        </Badge>
      );
  }
};
