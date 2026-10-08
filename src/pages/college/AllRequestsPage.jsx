import React, { useEffect, useState } from 'react';
import { budgetService } from '../../services/budgetService';
import { Header } from '../../components/layout/Header';
import { Card, CardHeader } from '../../components/ui/Card';
import { BudgetRequestTable } from '../../components/tables/BudgetRequestTable';
import { TableSkeleton } from '../../components/ui/Loader';
import { useToast } from '../../context/ToastContext';

export const AllRequestsPage = () => {
  const { showSuccess, showError, showInfo } = useToast();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const data = await budgetService.getBudgetRequests();
      setRequests(data);
    } catch (e) {
      showError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await budgetService.approveBudgetRequest(id, 'College Dean');
      showSuccess('Request approved and funds disbursed!', 'Approved');
      fetchRequests();
    } catch (e) {
      showError(e.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await budgetService.rejectBudgetRequest(id, 'Funds unavailable in fiscal pool', 'College Dean');
      showInfo('Request rejected.', 'Rejected');
      fetchRequests();
    } catch (e) {
      showError(e.message);
    }
  };

  if (isLoading) return <TableSkeleton rows={5} />;

  return (
    <div className="space-y-6">
      <Header
        title="Budget Approval Queue"
        subtitle="Review, approve, or reject department HOD requests for additional funding."
      />

      <Card>
        <CardHeader title="Authorization Requests Queue" subtitle="Full request history" />
        <BudgetRequestTable
          requests={requests}
          isCollegeAdmin={true}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </Card>
    </div>
  );
};
