import React, { useEffect, useState } from 'react';
import { budgetService } from '../../services/budgetService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Header } from '../../components/layout/Header';
import { Card, CardHeader } from '../../components/ui/Card';
import { OverspendingAlert } from '../../components/alerts/OverspendingAlert';
import { UtilizationGauge } from '../../components/charts/UtilizationGauge';
import { CategoryBreakdownChart } from '../../components/charts/CategoryBreakdownChart';
import { ExpenseTable } from '../../components/tables/ExpenseTable';
import { BudgetRequestTable } from '../../components/tables/BudgetRequestTable';
import { CardSkeleton } from '../../components/ui/Loader';
import { Modal } from '../../components/ui/Modal';
import { ExpenseForm } from '../../components/forms/ExpenseForm';
import { BudgetRequestForm } from '../../components/forms/BudgetRequestForm';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';
import { PlusCircle, FileSpreadsheet, Wallet, CreditCard, PiggyBank, Building2 } from 'lucide-react';

export const DepartmentDashboardPage = ({ onNavigate }) => {
  const { selectedDeptId, user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [department, setDepartment] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDeptData = async () => {
    setIsLoading(true);
    try {
      const deptData = await budgetService.getDepartmentById(selectedDeptId || 'dept-1');
      const deptExpenses = await budgetService.getExpenses({ deptId: deptData.id });
      const deptRequests = await budgetService.getBudgetRequests(deptData.id);

      setDepartment(deptData);
      setExpenses(deptExpenses);
      setRequests(deptRequests);
    } catch (e) {
      showError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeptData();
  }, [selectedDeptId]);

  if (isLoading || !department) return <CardSkeleton count={4} />;

  const remaining = department.allocatedBudget - department.spentAmount;

  return (
    <div className="space-y-6">
      {/* Header with Quick Action Buttons */}
      <Header
        title={`${department.name} (${department.code})`}
        subtitle={`HOD View: ${department.hodName} • Annual Fiscal Year 2025-26`}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={PlusCircle}
              onClick={() => setIsExpenseModalOpen(true)}
            >
              Log New Expense
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={FileSpreadsheet}
              onClick={() => setIsRequestModalOpen(true)}
            >
              Request Budget Top-up
            </Button>
          </div>
        }
      />

      {/* Overspending Banner Alert */}
      <OverspendingAlert
        department={department}
        actionText="Request Emergency Top-up"
        onActionClick={() => setIsRequestModalOpen(true)}
      />

      {/* Department Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-medium text-slate-400">Department Allocation</span>
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(department.allocatedBudget)}</div>
          <p className="text-xs text-slate-400 mt-1">({formatCompactCurrency(department.allocatedBudget)}) Baseline pool</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-medium text-slate-400">Total Spent to Date</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(department.spentAmount)}</div>
          <p className="text-xs text-indigo-400 mt-1">Logged expenses across all categories</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-medium text-slate-400">Remaining Unspent Funds</span>
            <div className={`p-2 rounded-xl border ${remaining < 0 ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-blue-500/15 text-blue-400 border-blue-500/30'}`}>
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-2xl font-bold ${remaining < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {formatCurrency(remaining)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {remaining < 0 ? 'Deficit - requires additional top-up' : 'Available balance'}
          </p>
        </Card>
      </div>

      {/* Utilization & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Department Category Expenditures"
            subtitle="Category-level breakdown for this department"
          />
          <CategoryBreakdownChart data={department.categoryBreakdown} />
        </Card>

        <Card>
          <CardHeader
            title="Budget Utilization Progress"
            subtitle="Real-time capacity meter"
          />
          <div className="space-y-6 pt-4">
            <UtilizationGauge
              spent={department.spentAmount}
              allocated={department.allocatedBudget}
            />

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Department HOD:</span>
                <span className="font-semibold text-slate-200">{department.hodName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">HOD Email:</span>
                <span className="font-mono text-slate-300">{department.hodEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Committed Orders:</span>
                <span className="font-bold text-amber-400">{formatCurrency(department.committedAmount)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Department Expense Ledger */}
      <Card>
        <CardHeader
          title="Recent Department Expenses"
          subtitle="All transactions logged by department staff & HOD"
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate('/department/expenses')}
            >
              View Full Ledger
            </Button>
          }
        />
        <ExpenseTable
          expenses={expenses}
          showDepartmentColumn={false}
          onAddExpenseClick={() => setIsExpenseModalOpen(true)}
        />
      </Card>

      {/* Department Budget Requests */}
      <Card>
        <CardHeader
          title="Department Budget Requests"
          subtitle="Status of additional budget allocation requests submitted to College Dean"
        />
        <BudgetRequestTable requests={requests} isCollegeAdmin={false} />
      </Card>

      {/* Modal: Log Expense */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title={`Log Expense - ${department.code}`}
        subtitle="Record new item purchase or service expenditure"
      >
        <ExpenseForm
          defaultDeptCode={department.code}
          onSubmit={async (payload) => {
            setIsSubmitting(true);
            try {
              await budgetService.addExpense({
                ...payload,
                deptId: department.id,
                deptCode: department.code,
              });
              showSuccess('Expense logged and deducted from department budget!', 'Expense Recorded');
              setIsExpenseModalOpen(false);
              fetchDeptData();
            } catch (e) {
              showError(e.message);
            } finally {
              setIsSubmitting(false);
            }
          }}
          onCancel={() => setIsExpenseModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Modal: Request Budget */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title={`Submit Budget Request - ${department.code}`}
        subtitle="Request additional budget allocation from College Admin"
      >
        <BudgetRequestForm
          defaultDeptCode={department.code}
          onSubmit={async (payload) => {
            setIsSubmitting(true);
            try {
              await budgetService.submitBudgetRequest({
                ...payload,
                deptId: department.id,
                deptCode: department.code,
                deptName: department.name,
              });
              showSuccess('Budget request submitted for Dean authorization!', 'Request Submitted');
              setIsRequestModalOpen(false);
              fetchDeptData();
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
