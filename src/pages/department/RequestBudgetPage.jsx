import React, { useEffect, useState } from 'react';
import { budgetService } from '../../services/budgetService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Header } from '../../components/layout/Header';
import { Card, CardHeader } from '../../components/ui/Card';
import { BudgetRequestTable } from '../../components/tables/BudgetRequestTable';
import { BudgetRequestForm } from '../../components/forms/BudgetRequestForm';
import { TableSkeleton } from '../../components/ui/Loader';

export const RequestBudgetPage = () => {
  const { selectedDeptId } = useAuth();
  const { showSuccess, showError } = useToast();
  const [requests, setRequests] = useState([]);
  const [dept, setDept] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const d = await budgetService.getDepartmentById(selectedDeptId || 'dept-1');
      const reqs = await budgetService.getBudgetRequests(d.id);
      setDept(d);
      setRequests(reqs);
    } catch (e) {
      showError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDeptId]);

  if (isLoading || !dept) return <TableSkeleton rows={4} />;

  return (
    <div className="space-y-6">
      <Header
        title={`Request Budget - ${dept.code}`}
        subtitle="Submit additional budget requests to College Admin with justification."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader title="New Request Form" subtitle="Fill required details" />
          <BudgetRequestForm
            defaultDeptCode={dept.code}
            onSubmit={async (payload) => {
              setIsSubmitting(true);
              try {
                await budgetService.submitBudgetRequest({
                  ...payload,
                  deptId: dept.id,
                  deptCode: dept.code,
                  deptName: dept.name,
                });
                showSuccess('Request submitted successfully!', 'Submitted');
                loadData();
              } catch (e) {
                showError(e.message);
              } finally {
                setIsSubmitting(false);
              }
            }}
            isLoading={isSubmitting}
          />
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Submitted Requests Queue" subtitle="Track approval status" />
          <BudgetRequestTable requests={requests} isCollegeAdmin={false} />
        </Card>
      </div>
    </div>
  );
};
