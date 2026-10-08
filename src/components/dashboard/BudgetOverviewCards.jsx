import React from 'react';
import { Wallet, CreditCard, PiggyBank, ShieldAlert, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';

export const BudgetOverviewCards = ({
  totalAllocated = 0,
  totalSpent = 0,
  remainingBudget = 0,
  overspentCount = 0,
  warningCount = 0,
  pendingRequestsCount = 0,
}) => {
  const utilization = totalAllocated > 0 ? Number(((totalSpent / totalAllocated) * 100).toFixed(1)) : 0;

  const cards = [
    {
      title: 'Total College Allocation',
      value: formatCurrency(totalAllocated),
      compact: formatCompactCurrency(totalAllocated),
      subtext: `FY 2025-26 Budget Pool`,
      icon: Wallet,
      iconBg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      trend: '+8.5% vs last FY',
      trendPositive: true,
    },
    {
      title: 'Total Spent to Date',
      value: formatCurrency(totalSpent),
      compact: formatCompactCurrency(totalSpent),
      subtext: `${utilization}% of total pool utilized`,
      icon: CreditCard,
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      progress: utilization,
    },
    {
      title: 'Remaining Balance',
      value: formatCurrency(remainingBudget),
      compact: formatCompactCurrency(remainingBudget),
      subtext: remainingBudget < 0 ? 'Deficit detected' : 'Available for allocation',
      icon: PiggyBank,
      iconBg: remainingBudget < 0 ? 'bg-red-500/15 text-red-400 border-red-500/30' : 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      isDanger: remainingBudget < 0,
    },
    {
      title: 'Risk & Queue Status',
      value: `${overspentCount} Overspent`,
      subtext: `${warningCount} in Warning (>85%) • ${pendingRequestsCount} Pending Requests`,
      icon: ShieldAlert,
      iconBg: overspentCount > 0 ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' : 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      hasAlert: overspentCount > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <div
            key={idx}
            className={`glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between ${
              card.hasAlert ? 'border-red-500/40 shadow-lg shadow-red-950/40' : ''
            }`}
          >
            {/* Background Glow Accent */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-medium text-slate-400">{card.title}</span>
                <div className={`p-2.5 rounded-xl border ${card.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                {card.value}
              </div>

              {card.compact && (
                <span className="text-[11px] font-semibold text-slate-400 mt-0.5 inline-block">
                  ({card.compact})
                </span>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>{card.subtext}</span>
              {card.trend && (
                <span className={`inline-flex items-center gap-0.5 font-semibold ${card.trendPositive ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {card.trendPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {card.trend}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
