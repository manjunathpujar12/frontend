import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  }[size] || 'w-6 h-6';

  return <Loader2 className={`animate-spin text-indigo-500 ${sizeClasses} ${className}`} />;
};

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 animate-shimmer rounded-md"></div>
            <div className="h-8 w-8 animate-shimmer rounded-xl"></div>
          </div>
          <div className="h-8 w-36 animate-shimmer rounded-md"></div>
          <div className="h-2 w-full animate-shimmer rounded-full"></div>
          <div className="flex justify-between">
            <div className="h-3 w-16 animate-shimmer rounded-md"></div>
            <div className="h-3 w-20 animate-shimmer rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-3">
      <div className="h-10 w-full animate-shimmer rounded-xl"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 w-full animate-shimmer rounded-xl"></div>
      ))}
    </div>
  );
};
