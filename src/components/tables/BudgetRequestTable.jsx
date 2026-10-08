import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, Building2, User } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const BudgetRequestTable = ({
  requests = [],
  onApprove,
  onReject,
  isCollegeAdmin = false,
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            <th className="py-3.5 px-4">Request & Justification</th>
            <th className="py-3.5 px-4">Department / HOD</th>
            <th className="py-3.5 px-4 text-center">Urgency</th>
            <th className="py-3.5 px-4 text-right">Requested Amount (₹)</th>
            <th className="py-3.5 px-4">Date</th>
            <th className="py-3.5 px-4 text-center">Status</th>
            {isCollegeAdmin && <th className="py-3.5 px-4 text-center">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-200">
          {requests.length === 0 ? (
            <tr>
              <td colSpan={isCollegeAdmin ? 7 : 6} className="text-center py-8 text-slate-400">
                No budget requests in queue.
              </td>
            </tr>
          ) : (
            requests.map((req) => {
              const isPending = req.status === 'PENDING';

              const urgencyBadge = {
                CRITICAL: 'bg-red-500/20 text-red-300 border-red-500/40',
                HIGH: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                MEDIUM: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
                LOW: 'bg-slate-800 text-slate-400 border-slate-700',
              }[req.urgency] || 'bg-slate-800 text-slate-400';

              return (
                <tr key={req.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-4 px-4 max-w-sm">
                    <div className="font-semibold text-slate-100">{req.title}</div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      "{req.justification}"
                    </div>
                    <div className="text-[10px] text-indigo-400 mt-1 font-medium">Category: {req.category}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 font-medium text-slate-200">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{req.deptCode}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{req.requestedBy}</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${urgencyBadge}`}>
                      {req.urgency}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-emerald-400 text-sm">
                    {formatCurrency(req.amountRequested)}
                  </td>
                  <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                    {formatDate(req.createdAt)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <StatusBadge status={req.status} />
                  </td>
                  {isCollegeAdmin && (
                    <td className="py-4 px-4 text-center">
                      {isPending ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => onApprove(req.id)}
                            icon={CheckCircle2}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => onReject(req.id)}
                            icon={XCircle}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">
                          {req.status === 'APPROVED' ? `Approved by ${req.approvedBy}` : 'Processed'}
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
