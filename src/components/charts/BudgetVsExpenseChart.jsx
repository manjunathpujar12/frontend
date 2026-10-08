import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters';

export const BudgetVsExpenseChart = ({ departments = [] }) => {
  const chartData = departments.map((d) => ({
    name: d.code,
    fullName: d.name,
    Allocated: d.allocatedBudget,
    Spent: d.spentAmount,
    utilization: Number(((d.spentAmount / d.allocatedBudget) * 100).toFixed(1)),
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1.5">
          <p className="font-semibold text-slate-100">{data.fullName} ({label})</p>
          <div className="flex items-center justify-between gap-4 text-indigo-300">
            <span>Allocated:</span>
            <span className="font-bold">{formatCurrency(data.Allocated)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-emerald-300">
            <span>Spent:</span>
            <span className="font-bold">{formatCurrency(data.Spent)}</span>
          </div>
          <div className="pt-1 border-t border-slate-800 flex items-center justify-between gap-4">
            <span className="text-slate-400">Utilization:</span>
            <span className={`font-bold ${data.utilization > 100 ? 'text-red-400' : 'text-slate-200'}`}>
              {data.utilization}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 10, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <YAxis
            stroke="#94a3b8"
            tick={{ fontSize: 11 }}
            tickFormatter={(val) => formatCompactCurrency(val)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
            formatter={(value) => <span className="text-slate-300 font-medium">{value}</span>}
          />
          <Bar dataKey="Allocated" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={32} />
          <Bar dataKey="Spent" radius={[6, 6, 0, 0]} maxBarSize={32}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.utilization > 100 ? '#ef4444' : entry.utilization >= 85 ? '#f59e0b' : '#10b981'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
