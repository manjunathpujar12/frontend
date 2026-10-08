import React from 'react';
import { AlertTriangle, TrendingUp, ShieldAlert, ArrowRight } from 'lucide-react';
import { formatCurrency, calculateUtilization } from '../../utils/formatters';
import { Button } from '../ui/Button';

export const OverspendingAlert = ({
  department,
  onActionClick,
  actionText = 'Request Budget Top-up',
}) => {
  if (!department) return null;

  const { name, code, allocatedBudget, spentAmount } = department;
  const pct = calculateUtilization(spentAmount, allocatedBudget);

  if (pct < 85) return null; // Only trigger alert for >85%

  const isOverspent = pct > 100;
  const excess = isOverspent ? spentAmount - allocatedBudget : 0;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 mb-6 border transition-all ${
        isOverspent
          ? 'bg-gradient-to-r from-red-950/80 via-red-900/40 to-slate-900 border-red-500/50 shadow-xl shadow-red-950/50 pulse-alert'
          : 'bg-gradient-to-r from-amber-950/70 via-amber-900/30 to-slate-900 border-amber-500/40'
      }`}
    >
      {/* Background Accent */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl shrink-0 ${
              isOverspent ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            {isOverspent ? <ShieldAlert className="w-6 h-6 animate-bounce" /> : <AlertTriangle className="w-6 h-6" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase rounded-md ${
                  isOverspent ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-950'
                }`}
              >
                {isOverspent ? 'CRITICAL OVERSPEND ALERT' : 'HIGH UTILIZATION WARNING'}
              </span>
              <span className="text-xs text-slate-400">Dept: {code}</span>
            </div>

            <h4 className="text-base font-bold text-white mt-1">
              {isOverspent
                ? `${name} has exceeded allocated budget by ${formatCurrency(excess)} (${pct}%)`
                : `${name} has reached ${pct}% of total annual allocation`}
            </h4>

            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {isOverspent
                ? 'Department expenses have exceeded the baseline limit. Further purchase orders may be auto-flagged for audit.'
                : 'Current spending velocity indicates potential budget depletion before fiscal year end.'}
            </p>
          </div>
        </div>

        {onActionClick && (
          <div className="shrink-0 flex items-center gap-3">
            <Button
              onClick={onActionClick}
              variant={isOverspent ? 'danger' : 'secondary'}
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
            >
              {actionText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
