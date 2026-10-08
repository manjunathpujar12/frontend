import React, { useEffect, useState } from 'react';
import { budgetService } from '../../services/budgetService';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/layout/Header';
import { Card, CardHeader } from '../../components/ui/Card';
import { CategoryBreakdownChart } from '../../components/charts/CategoryBreakdownChart';
import { formatCurrency } from '../../utils/formatters';
import { CardSkeleton } from '../../components/ui/Loader';
import { Tag } from 'lucide-react';

export const CategoryBreakdownPage = () => {
  const { selectedDeptId } = useAuth();
  const [dept, setDept] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDept = async () => {
      setIsLoading(true);
      try {
        const d = await budgetService.getDepartmentById(selectedDeptId || 'dept-1');
        setDept(d);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDept();
  }, [selectedDeptId]);

  if (isLoading || !dept) return <CardSkeleton count={3} />;

  return (
    <div className="space-y-6">
      <Header
        title={`Category Analytics - ${dept.name}`}
        subtitle="Distribution of department expenditures across specialized budget heads."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Expenditure Distribution" subtitle="Visual donut breakdown" />
          <CategoryBreakdownChart data={dept.categoryBreakdown} />
        </Card>

        <Card>
          <CardHeader title="Category Totals" subtitle="Itemized list" />
          <div className="space-y-3">
            {dept.categoryBreakdown.map((cat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2 font-medium text-slate-200">
                  <Tag className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{cat.category}</span>
                </div>
                <span className="font-bold text-emerald-400">{formatCurrency(cat.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
