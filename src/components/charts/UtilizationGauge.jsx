import React from 'react';
import { formatCurrency, getBudgetHealth } from '../../utils/formatters';

export const UtilizationGauge = ({ spent = 0, allocated = 1, showDetails = true }) => {
  const percentage = Math.min(Number(((spent / allocated) * 100).toFixed(1)), 100);
  const rawPercentage = Number(((spent / allocated) * 100).toFixed(1));
  const health = getBudgetHealth(spent, allocated);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">Budget Utilization</span>
        <span className={`font-bold ${rawPercentage > 100 ? 'text-red-400' : 'text-slate-200'}`}>
          {rawPercentage}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-3 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/50 relative">
        <div
          className={`h-full rounded-full transition-all duration-500 ${health.progressClass}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {showDetails && (
        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-0.5">
          <span>Spent: {formatCurrency(spent)}</span>
          <span>Max: {formatCurrency(allocated)}</span>
        </div>
      )}
    </div>
  );
};
