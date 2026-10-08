import React from 'react';
import { Building2, Edit2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { formatCurrency, calculateUtilization, getBudgetHealth } from '../../utils/formatters';
import { StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const BudgetAllocationTable = ({ departments = [], onEditAllocation, onViewDepartment }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            <th className="py-3.5 px-4">Department</th>
            <th className="py-3.5 px-4">HOD / Contact</th>
            <th className="py-3.5 px-4 text-right">Baseline Budget (₹)</th>
            <th className="py-3.5 px-4 text-right">Spent Amount (₹)</th>
            <th className="py-3.5 px-4 text-right">Remaining (₹)</th>
            <th className="py-3.5 px-4">Utilization Meter</th>
            <th className="py-3.5 px-4 text-center">Status</th>
            <th className="py-3.5 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-200">
          {departments.map((dept) => {
            const { id, code, name, hodName, hodEmail, allocatedBudget, spentAmount } = dept;
            const remaining = allocatedBudget - spentAmount;
            const pct = calculateUtilization(spentAmount, allocatedBudget);
            const health = getBudgetHealth(spentAmount, allocatedBudget);
            const isOver = pct > 100;

            return (
              <tr key={id} className="hover:bg-slate-850/50 transition-colors">
                <td className="py-4 px-4 font-semibold text-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                      {code}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{name}</div>
                      <div className="text-[11px] text-slate-400">Code: {code}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-300">
                  <div className="font-medium">{hodName}</div>
                  <div className="text-[11px] text-slate-500">{hodEmail}</div>
                </td>
                <td className="py-4 px-4 text-right font-bold text-slate-100">
                  {formatCurrency(allocatedBudget)}
                </td>
                <td className="py-4 px-4 text-right font-bold text-indigo-400">
                  {formatCurrency(spentAmount)}
                </td>
                <td className={`py-4 px-4 text-right font-bold ${isOver ? 'text-red-400' : 'text-emerald-400'}`}>
                  {formatCurrency(remaining)}
                </td>
                <td className="py-4 px-4 min-w-[160px]">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-400">{pct}%</span>
                    {isOver && (
                      <span className="text-red-400 font-bold flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3" /> Over
                      </span>
                    )}
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${health.progressClass}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    ></div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <StatusBadge status={health.status} />
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {onEditAllocation && (
                      <button
                        onClick={() => onEditAllocation(dept)}
                        title="Adjust Budget Allocation"
                        className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {onViewDepartment && (
                      <button
                        onClick={() => onViewDepartment(dept.id)}
                        title="View Department Dashboard"
                        className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
