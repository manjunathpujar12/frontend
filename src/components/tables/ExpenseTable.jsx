import React, { useState } from 'react';
import { Search, Filter, FileText, ArrowUpDown, Calendar, Tag, Building2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const ExpenseTable = ({ expenses = [], onAddExpenseClick, showDepartmentColumn = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('desc'); // desc: newest/highest first

  // Filtering
  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deptCode?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortOrder === 'desc') {
      return new Date(b.date) - new Date(a.date);
    }
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div className="w-full space-y-4">
      {/* Search & Filter Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search expenses, vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">All Categories</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white shrink-0"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
            <span>Date: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>

          {onAddExpenseClick && (
            <Button size="sm" onClick={onAddExpenseClick} className="shrink-0">
              Log Expense
            </Button>
          )}
        </div>
      </div>

      {/* Table Component */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Expense Details</th>
              {showDepartmentColumn && <th className="py-3.5 px-4">Department</th>}
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Vendor / Payee</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Amount (₹)</th>
              <th className="py-3.5 px-4 text-center">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={showDepartmentColumn ? 7 : 6} className="text-center py-10 text-slate-400">
                  No expense records match your current filters.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-100">{exp.title}</div>
                    {exp.notes && <div className="text-[11px] text-slate-400 mt-0.5 italic">{exp.notes}</div>}
                  </td>
                  {showDepartmentColumn && (
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-medium text-slate-300">
                        <Building2 className="w-3 h-3 text-indigo-400" />
                        {exp.deptCode}
                      </span>
                    </td>
                  )}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-slate-300">
                      <Tag className="w-3 h-3 text-slate-400" />
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{exp.vendor}</td>
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {formatDate(exp.date)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-400 text-sm">
                    {formatCurrency(exp.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => alert(`Opening digital receipt voucher for ${exp.title}`)}
                      className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 hover:underline text-[11px] font-medium"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
