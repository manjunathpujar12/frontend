import React, { useEffect, useState } from 'react';
import { budgetService } from '../../services/budgetService';
import { Header } from '../../components/layout/Header';
import { Card, CardHeader } from '../../components/ui/Card';
import { BudgetAllocationTable } from '../../components/tables/BudgetAllocationTable';
import { TableSkeleton } from '../../components/ui/Loader';
import { Modal } from '../../components/ui/Modal';
import { AllocationForm } from '../../components/forms/AllocationForm';
import { useToast } from '../../context/ToastContext';

export const BudgetAllocationPage = () => {
  const { showSuccess, showError } = useToast();
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDept, setEditingDept] = useState(null);

  const fetchDepts = async () => {
    setIsLoading(true);
    try {
      const data = await budgetService.getDepartments();
      setDepartments(data);
    } catch (e) {
      showError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const handleUpdate = async (deptId, newAmount) => {
    try {
      await budgetService.updateDepartmentAllocation(deptId, newAmount);
      showSuccess('Baseline allocation updated!', 'Success');
      setEditingDept(null);
      fetchDepts();
    } catch (e) {
      showError(e.message);
    }
  };

  if (isLoading) return <TableSkeleton rows={6} />;

  return (
    <div className="space-y-6">
      <Header
        title="College Budget Allocation"
        subtitle="Set baseline annual allocations per department and adjust caps dynamically."
      />

      <Card>
        <CardHeader
          title="Baseline Allocation Ledger"
          subtitle="Annual financial commitments and spending caps"
        />
        <BudgetAllocationTable
          departments={departments}
          onEditAllocation={(dept) => setEditingDept(dept)}
        />
      </Card>

      <Modal
        isOpen={Boolean(editingDept)}
        onClose={() => setEditingDept(null)}
        title="Edit Allocation"
      >
        <AllocationForm
          department={editingDept}
          onSubmit={handleUpdate}
          onCancel={() => setEditingDept(null)}
        />
      </Modal>
    </div>
  );
};
