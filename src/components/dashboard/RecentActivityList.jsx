import React from 'react';
import { Activity, ShieldAlert, CheckCircle, PlusCircle, ArrowRight } from 'lucide-react';

export const RecentActivityList = ({ logs = [], limit = 5 }) => {
  const displayLogs = logs.slice(0, limit);

  return (
    <div className="space-y-3">
      {displayLogs.map((log) => {
        const isAlert = log.action.includes('Overspending') || log.role === 'SYSTEM';

        return (
          <div
            key={log.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors text-xs"
          >
            <div
              className={`p-2 rounded-lg shrink-0 ${
                isAlert
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                  : 'bg-indigo-500/15 text-indigo-400'
              }`}
            >
              {isAlert ? <ShieldAlert className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-200 truncate">{log.action}</span>
                <span className="text-[10px] text-slate-500 whitespace-nowrap">{log.timestamp}</span>
              </div>
              <p className="text-slate-400 mt-0.5 line-clamp-1">{log.details}</p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                <span>By: {log.user}</span>
                <span>•</span>
                <span className="text-indigo-400 font-medium">{log.role}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
