import React, { useEffect, useState } from 'react';
import { budgetService } from '../../services/budgetService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Header } from '../../components/layout/Header';
import { Card, CardHeader } from '../../components/ui/Card';
import { ExpenseTable } from '../../components/tables/ExpenseTable';
import { TableSkeleton } from '../../components/ui/Loader';
import { Modal } from '../../components/ui/Modal';
import { ExpenseForm } from '../../components/forms/ExpenseForm';

export const ExpensesPage = () => {
  const { selectedDeptId } = useAuth();
  const { showSuccess, showError } = useToast();
  const [expenses, setExpenses] = useState([]);
  const [dept, setDept] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const d = await budgetService.getDepartmentById(selectedDeptId || 'dept-1');
      const exps = await budgetService.getExpenses({ deptId: d.id });
      setDept(d);
      setExpenses(exps);
    } catch (e) {
      showError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDeptId]);

  if (isLoading || !dept) return <TableSkeleton rows={5} />;

  return (
    <div className="space-y-6">
      <Header
        title={`Expense Ledger - ${dept.name}`}
        subtitle="Searchable record of all department expenditures, receipt vouchers, and payment methods."
      />

      <Card>
        <CardHeader title="Department Expenses" subtitle="Search and filter items" />
        <ExpenseTable
          expenses={expenses}
          showDepartmentColumn={false}
          onAddExpenseClick={() => setIsModalOpen(true)}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log New Expense"
      >
        <ExpenseForm
          defaultDeptCode={dept.code}
          onSubmit={async (payload) => {
            setIsSubmitting(true);
            try {
              await budgetService.addExpense({
                ...payload,
                deptId: dept.id,
                deptCode: dept.code,
              });
              showSuccess('Expense logged successfully!', 'Success');
              setIsModalOpen(false);
              loadData();
            } catch (e) {
              showError(e.message);
            } finally {
              setIsSubmitting(false);
            }
          }}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};
