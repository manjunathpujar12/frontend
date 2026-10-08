import React from 'react';
import { X, LayoutDashboard, Building2, PieChart, Receipt, FileSpreadsheet, History, Settings, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';

export const MobileNav = ({ isOpen, onClose, activePath, onNavigate }) => {
  const { currentRole, user } = useAuth();

  if (!isOpen) return null;

  const collegeAdminNav = [
    { id: '/college/dashboard', label: 'College Overview', icon: LayoutDashboard },
    { id: '/college/departments', label: 'Departments List', icon: Building2 },
    { id: '/college/allocations', label: 'Budget Allocation', icon: PieChart },
    { id: '/college/requests', label: 'Approval Queue', icon: FileSpreadsheet },
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
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Drawer Content */}
      <div className="relative flex flex-col w-4/5 max-w-xs bg-slate-900 border-r border-slate-800 p-5 z-10">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">
              ₹
            </div>
            <span className="font-bold text-white text-sm">SmartBudget</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePath === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
