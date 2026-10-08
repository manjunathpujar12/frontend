import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Failed to load financial data',
  message = 'An unexpected error occurred while communicating with the server. Please verify network connectivity.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center bg-red-950/20 border border-red-500/30 rounded-2xl">
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-red-300">{title}</h4>
      <p className="text-xs text-slate-400 max-w-md mt-1 mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" icon={RefreshCw}>
          Retry Connection
        </Button>
      )}
    </div>
  );
};
