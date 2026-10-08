import React, { useEffect, useState } from 'react';
import { budgetService } from '../../services/budgetService';
import { useToast } from '../../context/ToastContext';
import { Header } from '../../components/layout/Header';
import { BudgetOverviewCards } from '../../components/dashboard/BudgetOverviewCards';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { OverspendingAlert } from '../../components/alerts/OverspendingAlert';
import { BudgetVsExpenseChart } from '../../components/charts/BudgetVsExpenseChart';
import { CategoryBreakdownChart } from '../../components/charts/CategoryBreakdownChart';
import { BudgetAllocationTable } from '../../components/tables/BudgetAllocationTable';
import { BudgetRequestTable } from '../../components/tables/BudgetRequestTable';
import { RecentActivityList } from '../../components/dashboard/RecentActivityList';
import { Card, CardHeader } from '../../components/ui/Card';
import { CardSkeleton, TableSkeleton } from '../../components/ui/Loader';
import { ErrorState } from '../../components/ui/ErrorState';
import { Modal } from '../../components/ui/Modal';
import { AllocationForm } from '../../components/forms/AllocationForm';
import { BudgetRequestForm } from '../../components/forms/BudgetRequestForm';
import { useAuth } from '../../context/AuthContext';
import { Building2, PieChart, Clock, Activity } from 'lucide-react';

export const CollegeDashboardPage = ({ onNavigate }) => {
  const { showSuccess, showError, showInfo } = useToast();
  const { setSelectedDeptId } = useAuth();
  const [summary, setSummary] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [editingDept, setEditingDept] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sumRes, deptRes, reqRes, logRes] = await Promise.all([
        budgetService.getCollegeSummary(),
        budgetService.getDepartments(),
        budgetService.getBudgetRequests(),
        budgetService.getAuditLogs(),
      ]);
      setSummary(sumRes);
      setDepartments(deptRes);
      setRequests(reqRes);
      setLogs(logRes);
    } catch (err) {
      setError(err.message || 'Failed to fetch financial dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Approve Request
  const handleApprove = async (requestId) => {
    try {
      await budgetService.approveBudgetRequest(requestId, 'College Dean');
      showSuccess('Budget request approved and funds allocated to department!', 'Request Approved');
      fetchData();
    } catch (err) {
      showError(err.message || 'Failed to approve request');
    }
  };

  // Handle Reject Request
  const handleReject = async (requestId) => {
    try {
      await budgetService.rejectBudgetRequest(requestId, 'Exceeds unallocated college contingency pool', 'College Dean');
      showInfo('Budget request rejected and logged in audit trail.', 'Request Rejected');
      fetchData();
    } catch (err) {
      showError(err.message || 'Failed to reject request');
    }
  };

  // Handle Update Allocation
  const handleUpdateAllocation = async (deptId, newAmount) => {
    setIsSubmitting(true);
    try {
      await budgetService.updateDepartmentAllocation(deptId, newAmount);
      showSuccess('Baseline allocation updated successfully!', 'Budget Updated');
      setEditingDept(null);
      fetchData();
    } catch (err) {
      showError(err.message || 'Failed to update allocation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Header title="College Financial Command Center" subtitle="Loading institutional budget data..." />
        <CardSkeleton count={4} />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  // Find department overspent for alert banner
  const overspentDept = departments.find((d) => (d.spentAmount / d.allocatedBudget) > 0.85);

  // Overall categories for pie chart
  const aggregatedCategories = departments.reduce((acc, dept) => {
    dept.categoryBreakdown.forEach((cat) => {
      const existing = acc.find((c) => c.category === cat.category);
      if (existing) {
        existing.amount += cat.amount;
      } else {
        acc.push({ category: cat.category, amount: cat.amount });
      }
    });
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header
        title="College Financial Command Center"
        subtitle="Institutional budget tracking, department allocations, and expenditure authorization queue."
      />

      {/* Overspending Banner Alert */}
      {overspentDept && (
        <OverspendingAlert
          department={overspentDept}
          actionText="Review Allocations"
          onActionClick={() => setEditingDept(overspentDept)}
        />
      )}

      {/* Top Overview Cards */}
      <BudgetOverviewCards
        totalAllocated={summary.totalAllocated}
        totalSpent={summary.totalSpent}
        remainingBudget={summary.remainingBudget}
        overspentCount={summary.overspentCount}
        warningCount={summary.warningCount}
        pendingRequestsCount={summary.pendingRequestsCount}
      />

      {/* Quick Actions Toolbar */}
      <QuickActions
        isCollegeAdmin={true}
        onAllocateBudget={() => setEditingDept(departments[0])}
        onRequestBudget={() => setIsRequestModalOpen(true)}
        onRefresh={fetchData}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Department Budget vs Expenditure"
            subtitle="Comparison of allocated baseline vs actual spent per department"
          />
          <BudgetVsExpenseChart departments={departments} />
        </Card>

        <Card>
          <CardHeader
            title="Institutional Spend Breakdown"
            subtitle="Expenditure distribution across categories"
          />
          <CategoryBreakdownChart data={aggregatedCategories} />
        </Card>
      </div>

      {/* Department Allocation & Health Table */}
      <Card>
        <CardHeader
          title="Department Baseline Allocations & Utilization"
          subtitle="Real-time monitoring of all college departments"
          action={
            <span className="text-xs text-indigo-400 font-semibold">
              Total Depts: {departments.length}
            </span>
          }
        />
        <BudgetAllocationTable
          departments={departments}
          onEditAllocation={(dept) => setEditingDept(dept)}
          onViewDepartment={(id) => {
            setSelectedDeptId(id);
            onNavigate('/department/dashboard');
          }}
        />
      </Card>

      {/* Pending Budget Approval Queue & Audit Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Budget Request Authorization Queue"
            subtitle="Pending and processed requests submitted by Department HODs"
          />
          <BudgetRequestTable
            requests={requests}
            isCollegeAdmin={true}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </Card>

        <Card>
          <CardHeader
            title="Financial Audit Activity"
            subtitle="Live ledger log of approvals & transactions"
          />
          <RecentActivityList logs={logs} limit={6} />
        </Card>
      </div>

      {/* Edit Allocation Modal */}
      <Modal
        isOpen={Boolean(editingDept)}
        onClose={() => setEditingDept(null)}
        title="Adjust Department Allocation"
        subtitle="Modify baseline financial allocation for fiscal year 2025-26"
      >
        <AllocationForm
          department={editingDept}
          onSubmit={handleUpdateAllocation}
          onCancel={() => setEditingDept(null)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Submit Budget Request Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Submit College Contingency Request"
        subtitle="Request extra funding allocation"
      >
        <BudgetRequestForm
          defaultDeptCode="CSE"
          onSubmit={async (payload) => {
            setIsSubmitting(true);
            try {
              await budgetService.submitBudgetRequest(payload);
              showSuccess('Budget request logged into authorization queue!', 'Request Logged');
              setIsRequestModalOpen(false);
              fetchData();
            } catch (e) {
              showError(e.message);
            } finally {
              setIsSubmitting(false);
            }
          }}
          onCancel={() => setIsRequestModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};
