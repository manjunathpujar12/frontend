import React from 'react';
import { Info, X } from 'lucide-react';

export const WarningBanner = ({ message, type = 'info', onClose }) => {
  const styles = {
    info: 'bg-indigo-950/60 border-indigo-500/30 text-indigo-200',
    warning: 'bg-amber-950/60 border-amber-500/30 text-amber-200',
    danger: 'bg-red-950/60 border-red-500/30 text-red-200',
  }[type] || 'bg-slate-900 border-slate-700 text-slate-200';

  return (
    <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${styles}`}>
      <div className="flex items-center gap-2.5">
        <Info className="w-4 h-4 shrink-0" />
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="hover:opacity-80 p-0.5 rounded">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
