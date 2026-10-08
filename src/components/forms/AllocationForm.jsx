import React, { useState } from 'react';
import { IndianRupee, Save } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const AllocationForm = ({ department, onSubmit, onCancel, isLoading = false }) => {
  const [allocatedBudget, setAllocatedBudget] = useState(department?.allocatedBudget || '');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = Number(allocatedBudget);
    if (!val || val <= 0) {
      setError('Please enter a valid allocation amount');
      return;
    }
    onSubmit(department.id, val);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
        <p className="text-xs text-slate-400">Target Department</p>
        <p className="text-sm font-bold text-white">{department?.name} ({department?.code})</p>
        <p className="text-xs text-slate-400 mt-1">Current Allocation: <span className="text-indigo-400 font-semibold">{formatCurrency(department?.allocatedBudget)}</span></p>
        <p className="text-xs text-slate-400">Current Spent: <span className="text-emerald-400 font-semibold">{formatCurrency(department?.spentAmount)}</span></p>
      </div>

      <Input
        label="New Annual Budget Allocation (₹)"
        type="number"
        icon={IndianRupee}
        value={allocatedBudget}
        onChange={(e) => {
          setAllocatedBudget(e.target.value);
          if (error) setError(null);
        }}
        error={error}
        placeholder="e.g. 5500000"
      />

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading} icon={Save}>
          Save Allocation
        </Button>
      </div>
    </form>
  );
};
