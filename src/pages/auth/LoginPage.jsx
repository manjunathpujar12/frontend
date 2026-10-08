import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const LoginPage = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('principal@college.edu');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState(ROLES.COLLEGE_ADMIN);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      // Determine role from email
      const isDept = email.includes('hod') || selectedRole === ROLES.DEPARTMENT_ADMIN;
      const targetRole = isDept ? ROLES.DEPARTMENT_ADMIN : ROLES.COLLEGE_ADMIN;
      const targetDeptId = email.includes('ece') ? 'dept-2' : 'dept-1';

      login(email, password, targetRole, targetDeptId);
      setIsLoading(false);
      if (onLoginSuccess) onLoginSuccess(targetRole, targetDeptId);
    }, 400);
  };

  const handleQuickLogin = (role, targetEmail, deptId) => {
    setIsLoading(true);
    setTimeout(() => {
      login(targetEmail, 'password', role, deptId);
      setIsLoading(false);
      if (onLoginSuccess) onLoginSuccess(role, deptId);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Accent Glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Top Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 text-white font-black text-2xl shadow-xl shadow-indigo-600/30 mb-3">
            ₹
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">SmartBudget System</h1>
          <p className="text-xs text-slate-400 mt-1">
            Secure Department Budget & Financial Management Platform
          </p>
        </div>

        {/* Login Container */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">Sign In to Account</h2>
              <p className="text-xs text-slate-400">Authorized personnel login</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Secure Auth
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. principal@college.edu or hod.cse@college.edu"
              required
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 text-sm font-semibold"
              isLoading={isLoading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Role Login Presets */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
              ⚡ Select Role & Account Credentials
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickLogin(ROLES.COLLEGE_ADMIN, 'principal@college.edu')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition-all hover:border-indigo-500/50 group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-white">College Administrator</p>
                    <p className="text-[10px] text-slate-400">Full Access to All Departments & Budget Allocations</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(ROLES.DEPARTMENT_ADMIN, 'hod.cse@college.edu', 'dept-1')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition-all hover:border-indigo-500/50 group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-white">CSE Department HOD</p>
                    <p className="text-[10px] text-slate-400">Restricted strictly to Computer Science Dept</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(ROLES.DEPARTMENT_ADMIN, 'hod.ece@college.edu', 'dept-2')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition-all hover:border-indigo-500/50 group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-white">ECE Department HOD</p>
                    <p className="text-[10px] text-red-400">Restricted strictly to Electronics Dept</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
