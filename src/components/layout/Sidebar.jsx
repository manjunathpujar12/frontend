import React from 'react';
import {
  LayoutDashboard,
  Building2,
  PieChart,
  Receipt,
  FileSpreadsheet,
  History,
  Settings,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_LABELS } from '../../utils/constants';

export const Sidebar = ({ activePath, onNavigate }) => {
  const { currentRole, user } = useAuth();

  const collegeAdminNav = [
    { id: '/college/dashboard', label: 'College Overview', icon: LayoutDashboard },
    { id: '/college/departments', label: 'Departments List', icon: Building2 },
    { id: '/college/allocations', label: 'Budget Allocation', icon: PieChart },
    { id: '/college/requests', label: 'Approval Queue', icon: FileSpreadsheet, badge: '2' },
    { id: '/college/audit-logs', label: 'Audit Logs', icon: History },
    { id: '/admin/settings', label: 'System Settings', icon: Settings },
  ];

  const departmentAdminNav = [
    { id: '/department/dashboard', label: 'My Dept Overview', icon: LayoutDashboard },
    { id: '/department/expenses', label: 'Expense Ledger', icon: Receipt },
    { id: '/department/requests', label: 'Request Budget', icon: FileSpreadsheet },
    { id: '/department/categories', label: 'Category Analytics', icon: TrendingUp },
  ];

  const navItems = currentRole === ROLES.DEPARTMENT_ADMIN ? departmentAdminNav : collegeAdminNav;

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800/80 min-h-screen p-4 shrink-0 text-slate-200">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3 py-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 font-extrabold text-xl">
          ₹
        </div>
        <div>
          <h1 className="text-base font-bold text-white leading-tight">SmartBudget</h1>
          <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
            Finance Control
          </p>
        </div>
      </div>

      {/* Role Pill Notice */}
      <div className="mb-6 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5 text-xs">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] text-slate-400 font-medium">Active Mode</p>
          <p className="font-semibold text-slate-200 truncate">
            {currentRole === ROLES.DEPARTMENT_ADMIN ? `${user.deptCode || 'CSE'} HOD` : 'College Admin'}
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <div className="space-y-1 flex-1">
        <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          {currentRole === ROLES.DEPARTMENT_ADMIN ? 'Department Nav' : 'Main Management'}
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500/50'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {item.badge}
                </span>
              ) : (
                isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between px-2">
        <span>Academic Year 2025-26</span>
        <span className="text-emerald-400 font-semibold">● Online</span>
      </div>
    </aside>
  );
};
