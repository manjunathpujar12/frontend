import React from 'react';
import { Bell, Search, ShieldCheck, Menu, LogOut, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, DEPARTMENTS } from '../../utils/constants';

export const Navbar = ({ onOpenMobileMenu, onNavigate }) => {
  const { user, currentRole, selectedDeptId, setSelectedDeptId, logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (onNavigate) onNavigate('/college/dashboard');
  };

  const handleDeptSelect = (e) => {
    const newDeptId = e.target.value;
    setSelectedDeptId(newDeptId);
    if (onNavigate) {
      onNavigate('/department/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile menu trigger & Search */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-slate-300 hover:bg-slate-800 rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 relative w-64 lg:w-80">
            <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search expenses, budgets..."
              className="w-full bg-slate-950/70 text-slate-200 text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Right Side: Department Inspector & Logout */}
        <div className="flex items-center gap-3">
          {/* Department Inspector dropdown for COLLEGE ADMIN only */}
          {currentRole === ROLES.COLLEGE_ADMIN ? (
            <div className="hidden md:flex items-center gap-1.5 bg-slate-950/80 px-3 py-1 rounded-xl border border-slate-800 text-xs">
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Inspect Dept:</span>
              <select
                value={selectedDeptId || 'dept-1'}
                onChange={handleDeptSelect}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs font-medium"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id} className="bg-slate-900 text-slate-200">
                    {d.code} Department
                  </option>
                ))}
              </select>
            </div>
          ) : (
            /* Restricted HOD Badge */
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Building className="w-3.5 h-3.5" />
              <span>{user?.deptCode || 'CSE'} Department HOD</span>
            </div>
          )}

          {/* Notifications Bell */}
          <button
            onClick={() => alert('Notification: Financial audit alerts monitored.')}
            className="relative p-2 text-slate-300 hover:bg-slate-800 rounded-xl transition-colors border border-slate-800"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          </button>

          {/* User Profile Info */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover border border-indigo-500/50"
            />
            <div className="hidden xl:block text-left text-xs">
              <p className="font-semibold text-slate-200 leading-none">{user?.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{user?.title}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30 text-xs font-semibold transition-all ml-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
