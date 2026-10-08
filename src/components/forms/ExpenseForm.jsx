import React, { useState } from 'react';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { IndianRupee, Upload, Plus, FileCheck } from 'lucide-react';

export const ExpenseForm = ({ onSubmit, onCancel, defaultDeptCode = 'CSE', isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: EXPENSE_CATEGORIES[0],
    amount: '',
    vendor: '',
    paymentMethod: 'Bank Transfer',
    notes: '',
    deptCode: defaultDeptCode,
  });

  const [receiptFile, setReceiptFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Expense title is required';
    if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.vendor.trim()) newErrors.vendor = 'Vendor / Payee name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      amount: Number(formData.amount),
      receiptUrl: receiptFile ? receiptFile.name : 'receipt_voucher.pdf',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Expense Title / Description"
        name="title"
        placeholder="e.g. Dell Workstations for Lab 3"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Expense Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={EXPENSE_CATEGORIES}
        />

        <Input
          label="Amount Spent (₹)"
          name="amount"
          type="number"
          placeholder="e.g. 150000"
          icon={IndianRupee}
          value={formData.amount}
          onChange={handleChange}
          error={errors.amount}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Vendor / Contractor Name"
          name="vendor"
          placeholder="e.g. Dell Technologies India"
          value={formData.vendor}
          onChange={handleChange}
          error={errors.vendor}
        />

        <Select
          label="Payment Method"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          options={['Bank Transfer', 'Corporate Credit Card', 'UPI / IMPS', 'Cheque']}
        />
      </div>

      {/* File Upload Zone */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-300">Upload Receipt / Invoice Voucher</label>
        <div className="relative border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 text-center bg-slate-950/40 transition-colors">
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="flex flex-col items-center justify-center gap-1.5">
            {receiptFile ? (
              <div className="flex items-center gap-2 text-emerald-400 font-medium text-xs">
                <FileCheck className="w-4 h-4" />
                <span>Attached: {receiptFile.name}</span>
              </div>
            ) : (
              <>
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-xs text-slate-300 font-medium">Click to select PDF or image invoice</span>
                <span className="text-[10px] text-slate-500">Max size 5MB (PDF, PNG, JPG)</span>
              </>
            )}
          </div>
        </div>
      </div>

      <Input
        label="Additional Remarks / PO Number (Optional)"
        name="notes"
        placeholder="e.g. Approved under FY26 Research Grant"
        value={formData.notes}
        onChange={handleChange}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading} icon={Plus}>
          Record Expense
        </Button>
      </div>
    </form>
  );
};
