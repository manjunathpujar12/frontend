import React, { useEffect, useState } from 'react';
import { budgetService } from '../../services/budgetService';
import { Header } from '../../components/layout/Header';
import { Card, CardHeader } from '../../components/ui/Card';
import { TableSkeleton } from '../../components/ui/Loader';
import { History, ShieldAlert, CheckCircle2, User, Globe } from 'lucide-react';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const data = await budgetService.getAuditLogs();
        setLogs(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (isLoading) return <TableSkeleton rows={6} />;

  return (
    <div className="space-y-6">
      <Header
        title="Financial Audit & Activity Logs"
        subtitle="Immutable ledger of budget approvals, overspending triggers, and expense submissions."
      />

      <Card>
        <CardHeader title="Audit Trail" subtitle="Logged actions across all college departments" />

        <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-900/50">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">User / Actor</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Action Performed</th>
                <th className="py-3.5 px-4">Event Details</th>
                <th className="py-3.5 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {logs.map((log) => {
                const isAlert = log.action.includes('Overspending') || log.role === 'SYSTEM';

                return (
                  <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 font-mono whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{log.user}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isAlert
                            ? 'bg-red-500/20 text-red-300 border-red-500/30'
                            : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                        }`}
                      >
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">{log.action}</td>
                    <td className="py-3.5 px-4 text-slate-300">{log.details}</td>
                    <td className="py-3.5 px-4 text-right text-slate-500 font-mono">{log.ip}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
