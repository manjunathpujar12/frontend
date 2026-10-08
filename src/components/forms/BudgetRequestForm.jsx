import React, { useState } from 'react';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { IndianRupee, Send, AlertCircle } from 'lucide-react';

export const BudgetRequestForm = ({ onSubmit, onCancel, defaultDeptCode = 'CSE', isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: EXPENSE_CATEGORIES[0],
    amountRequested: '',
    urgency: 'HIGH',
    justification: '',
    deptCode: defaultDeptCode,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.amountRequested || Number(formData.amountRequested) <= 0) {
      newErrors.amountRequested = 'Please enter a valid positive amount';
    }
    if (!formData.justification.trim() || formData.justification.length < 15) {
      newErrors.justification = 'Please provide detailed justification (min 15 chars)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      amountRequested: Number(formData.amountRequested),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Request Title / Project Name"
        name="title"
        placeholder="e.g. Additional GPU Compute Node for AI Research"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Budget Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={EXPENSE_CATEGORIES}
        />

        <Input
          label="Requested Amount (₹)"
          name="amountRequested"
          type="number"
          placeholder="e.g. 500000"
          icon={IndianRupee}
          value={formData.amountRequested}
          onChange={handleChange}
          error={errors.amountRequested}
        />
      </div>

      <Select
        label="Urgency Level"
        name="urgency"
        value={formData.urgency}
        onChange={handleChange}
        options={[
          { value: 'LOW', label: 'Low - Regular Planning' },
          { value: 'MEDIUM', label: 'Medium - Next Trimester Requirement' },
          { value: 'HIGH', label: 'High - Immediate Requirement' },
          { value: 'CRITICAL', label: 'Critical - Deficit Clearance / Mandatory Audit' },
        ]}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-300">Detailed Justification & ROI</label>
        <textarea
          name="justification"
          rows={3}
          placeholder="Describe why this additional budget allocation is necessary and how it impacts department objectives..."
          value={formData.justification}
          onChange={handleChange}
          className={`w-full bg-slate-950/70 text-slate-100 border rounded-xl p-3 text-sm transition-all focus:outline-none focus:ring-2 placeholder:text-slate-500 ${
            errors.justification
              ? 'border-red-500/80 focus:ring-red-500/50'
              : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30'
          }`}
        />
        {errors.justification && <p className="text-xs text-red-400">{errors.justification}</p>}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading} icon={Send}>
          Submit Budget Request
        </Button>
      </div>
    </form>
  );
};
