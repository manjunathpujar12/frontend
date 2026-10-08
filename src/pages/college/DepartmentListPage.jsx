import React, { useEffect, useState } from 'react';
import { budgetService } from '../../services/budgetService';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { UtilizationGauge } from '../../components/charts/UtilizationGauge';
import { formatCurrency } from '../../utils/formatters';
import { CardSkeleton } from '../../components/ui/Loader';
import { Building2, User, Mail, Edit3, ArrowRight } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { AllocationForm } from '../../components/forms/AllocationForm';
import { useToast } from '../../context/ToastContext';

export const DepartmentListPage = ({ onNavigate }) => {
  const { showSuccess, showError } = useToast();
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState(null);

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

  const handleUpdateAllocation = async (deptId, newAmount) => {
    try {
      await budgetService.updateDepartmentAllocation(deptId, newAmount);
      showSuccess('Baseline allocation updated!', 'Success');
      setSelectedDept(null);
      fetchDepts();
    } catch (e) {
      showError(e.message);
    }
  };

  if (isLoading) return <CardSkeleton count={6} />;

  return (
    <div className="space-y-6">
      <Header
        title="College Departments"
        subtitle="Manage baseline funding, monitor spend limits, and review department HOD contacts."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const remaining = dept.allocatedBudget - dept.spentAmount;

          return (
            <Card key={dept.id} hoverable>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400">
                    {dept.code}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{dept.name}</h3>
                    <p className="text-xs text-slate-400">Code: {dept.code}</p>
                  </div>
                </div>
              </div>

              {/* HOD info */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs space-y-1 mb-4">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{dept.hodName}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{dept.hodEmail}</span>
                </div>
              </div>

              {/* Utilization Gauge */}
              <UtilizationGauge spent={dept.spentAmount} allocated={dept.allocatedBudget} />

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Allocated</span>
                  <span className="font-bold text-white">{formatCurrency(dept.allocatedBudget)}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[11px] block">Remaining</span>
                  <span className={`font-bold ${remaining < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {formatCurrency(remaining)}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => setSelectedDept(dept)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Adjust Budget
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        isOpen={Boolean(selectedDept)}
        onClose={() => setSelectedDept(null)}
        title="Adjust Allocation"
      >
        <AllocationForm
          department={selectedDept}
          onSubmit={handleUpdateAllocation}
          onCancel={() => setSelectedDept(null)}
        />
      </Modal>
    </div>
  );
};
