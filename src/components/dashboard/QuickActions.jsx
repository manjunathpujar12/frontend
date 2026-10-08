import React from 'react';
import { PlusCircle, FileSpreadsheet, Download, RefreshCw, Layers } from 'lucide-react';
import { Button } from '../ui/Button';

export const QuickActions = ({
  onLogExpense,
  onRequestBudget,
  onAllocateBudget,
  onRefresh,
  isCollegeAdmin = false,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">
        Quick Actions:
      </span>

      {onLogExpense && (
        <Button size="sm" variant="primary" icon={PlusCircle} onClick={onLogExpense}>
          Log New Expense
        </Button>
      )}

      {onRequestBudget && (
        <Button size="sm" variant="secondary" icon={FileSpreadsheet} onClick={onRequestBudget}>
          Request Extra Budget
        </Button>
      )}

      {isCollegeAdmin && onAllocateBudget && (
        <Button size="sm" variant="outline" icon={Layers} onClick={onAllocateBudget}>
          Adjust Allocations
        </Button>
      )}

      <div className="ml-auto flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          icon={Download}
          onClick={() => alert('Downloading Financial Statement PDF (Mock Report)')}
        >
          Export Report
        </Button>

        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Refresh Data"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors border border-slate-800"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
