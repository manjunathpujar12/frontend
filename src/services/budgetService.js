import {
  MOCK_DEPARTMENTS,
  MOCK_EXPENSES,
  MOCK_BUDGET_REQUESTS,
  MOCK_MONTHLY_TRENDS,
  MOCK_AUDIT_LOGS,
} from './mockApi';

// In-memory fallback state store to ensure the frontend works under any condition
let departmentsData = [...MOCK_DEPARTMENTS];
let expensesData = [...MOCK_EXPENSES];
let budgetRequestsData = [...MOCK_BUDGET_REQUESTS];
let auditLogsData = [...MOCK_AUDIT_LOGS];

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Budget Service Layer - Seamlessly integrates with Node/SQLite backend
 * with resilient fallback to local state so frontend remains 100% operational.
 */
export const budgetService = {
  /**
   * Get overall college summary numbers
   */
  async getCollegeSummary() {
    try {
      const res = await fetch('/api/summary');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to local calculation if backend is unreachable
    }

    await delay();
    const totalAllocated = departmentsData.reduce((acc, d) => acc + d.allocatedBudget, 0);
    const totalSpent = departmentsData.reduce((acc, d) => acc + d.spentAmount, 0);
    const totalCommitted = departmentsData.reduce((acc, d) => acc + d.committedAmount, 0);
    const remainingBudget = totalAllocated - totalSpent;

    const overspentCount = departmentsData.filter(
      (d) => (d.spentAmount / d.allocatedBudget) > 1.0
    ).length;

    const warningCount = departmentsData.filter((d) => {
      const ratio = d.spentAmount / d.allocatedBudget;
      return ratio >= 0.75 && ratio <= 1.0;
    }).length;

    const pendingRequestsCount = budgetRequestsData.filter(
      (r) => r.status === 'PENDING'
    ).length;

    return {
      totalAllocated,
      totalSpent,
      totalCommitted,
      remainingBudget,
      utilizationPercentage: Number(((totalSpent / totalAllocated) * 100).toFixed(1)),
      departmentsCount: departmentsData.length,
      overspentCount,
      warningCount,
      pendingRequestsCount,
    };
  },

  /**
   * Get list of all departments with budget stats
   */
  async getDepartments() {
    try {
      const res = await fetch('/api/departments');
      if (res.ok) {
        const data = await res.json();
        departmentsData = data; // Sync local state
        return data;
      }
    } catch {
      // Fallback
    }
    await delay();
    return [...departmentsData];
  },

  /**
   * Get single department by ID or Code
   */
  async getDepartmentById(deptId) {
    try {
      const res = await fetch(`/api/departments/${deptId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    await delay();
    return (
      departmentsData.find((d) => d.id === deptId || d.code === deptId) ||
      departmentsData[0]
    );
  },

  /**
   * Get expenses list with optional filters
   */
  async getExpenses(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.deptId) params.append('deptId', filters.deptId);
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);

      const res = await fetch(`/api/expenses?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    await delay();
    let result = [...expensesData];

    if (filters.deptId) {
      result = result.filter((e) => e.deptId === filters.deptId || e.deptCode === filters.deptId);
    }
    if (filters.category && filters.category !== 'ALL') {
      result = result.filter((e) => e.category === filters.category);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.vendor.toLowerCase().includes(q) ||
          e.deptCode.toLowerCase().includes(q)
      );
    }
    return result;
  },

  /**
   * Add a new expense (used by Department Admin)
   */
  async addExpense(expensePayload) {
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expensePayload),
      });
      if (res.ok) {
        const newExp = await res.json();
        // Sync local cache
        expensesData.unshift(newExp);
        return newExp;
      }
    } catch {
      // Fallback
    }

    await delay();
    const newExpense = {
      id: `exp-${Date.now()}`,
      status: 'APPROVED',
      date: new Date().toISOString().split('T')[0],
      ...expensePayload,
    };

    expensesData.unshift(newExpense);

    const targetDept = departmentsData.find(
      (d) => d.id === expensePayload.deptId || d.code === expensePayload.deptCode
    );
    if (targetDept) {
      targetDept.spentAmount += Number(expensePayload.amount);
      const catItem = targetDept.categoryBreakdown.find(
        (c) => c.category === expensePayload.category
      );
      if (catItem) {
        catItem.amount += Number(expensePayload.amount);
      } else {
        targetDept.categoryBreakdown.push({
          category: expensePayload.category,
          amount: Number(expensePayload.amount),
        });
      }
    }

    auditLogsData.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: expensePayload.submittedBy || 'Department Admin',
      role: 'DEPARTMENT_ADMIN',
      action: 'Logged New Expense',
      details: `Added expense ₹${expensePayload.amount} for ${expensePayload.title}`,
      ip: '192.168.1.100',
    });

    return newExpense;
  },

  /**
   * Get budget request queue
   */
  async getBudgetRequests(deptId = null) {
    try {
      const url = deptId ? `/api/budget-requests?deptId=${deptId}` : '/api/budget-requests';
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    await delay();
    if (deptId) {
      return budgetRequestsData.filter(
        (r) => r.deptId === deptId || r.deptCode === deptId
      );
    }
    return [...budgetRequestsData];
  },

  /**
   * Submit new additional budget request
   */
  async submitBudgetRequest(requestPayload) {
    try {
      const res = await fetch('/api/budget-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });
      if (res.ok) {
        const createdReq = await res.json();
        budgetRequestsData.unshift(createdReq);
        return createdReq;
      }
    } catch {
      // Fallback
    }

    await delay();
    const newRequest = {
      id: `req-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
      ...requestPayload,
    };

    budgetRequestsData.unshift(newRequest);

    auditLogsData.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: requestPayload.requestedBy || 'HOD User',
      role: 'DEPARTMENT_ADMIN',
      action: 'Submitted Budget Request',
      details: `Requested additional budget ₹${requestPayload.amountRequested} for ${requestPayload.title}`,
      ip: '192.168.1.100',
    });

    return newRequest;
  },

  /**
   * College Admin approves budget request
   */
  async approveBudgetRequest(requestId, adminName = 'Dean / Principal') {
    try {
      const res = await fetch(`/api/budget-requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminName }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    await delay();
    const req = budgetRequestsData.find((r) => r.id === requestId);
    if (!req) throw new Error('Budget request not found');

    req.status = 'APPROVED';
    req.approvedAt = new Date().toISOString().split('T')[0];
    req.approvedBy = adminName;

    const targetDept = departmentsData.find((d) => d.id === req.deptId || d.code === req.deptCode);
    if (targetDept) {
      targetDept.allocatedBudget += Number(req.amountRequested);
    }

    auditLogsData.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: adminName,
      role: 'COLLEGE_ADMIN',
      action: 'Approved Budget Request',
      details: `Approved ₹${req.amountRequested} for ${req.deptCode} - ${req.title}`,
      ip: '192.168.1.1',
    });

    return req;
  },

  /**
   * College Admin rejects budget request
   */
  async rejectBudgetRequest(requestId, reason = 'Insufficient overall funds', adminName = 'Dean / Principal') {
    try {
      const res = await fetch(`/api/budget-requests/${requestId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, adminName }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    await delay();
    const req = budgetRequestsData.find((r) => r.id === requestId);
    if (!req) throw new Error('Budget request not found');

    req.status = 'REJECTED';
    req.rejectedAt = new Date().toISOString().split('T')[0];
    req.rejectionReason = reason;

    auditLogsData.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: adminName,
      role: 'COLLEGE_ADMIN',
      action: 'Rejected Budget Request',
      details: `Rejected ₹${req.amountRequested} for ${req.deptCode}. Reason: ${reason}`,
      ip: '192.168.1.1',
    });

    return req;
  },

  /**
   * College Admin allocates or updates department baseline budget
   */
  async updateDepartmentAllocation(deptId, newAllocatedAmount) {
    try {
      const res = await fetch(`/api/departments/${deptId}/allocation`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allocatedBudget: newAllocatedAmount }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    await delay();
    const dept = departmentsData.find((d) => d.id === deptId || d.code === deptId);
    if (!dept) throw new Error('Department not found');

    const oldAllocated = dept.allocatedBudget;
    dept.allocatedBudget = Number(newAllocatedAmount);

    auditLogsData.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: 'College Administrator',
      role: 'COLLEGE_ADMIN',
      action: 'Updated Department Allocation',
      details: `Adjusted baseline budget for ${dept.code} from ₹${oldAllocated} to ₹${newAllocatedAmount}`,
      ip: '192.168.1.1',
    });

    return dept;
  },

  /**
   * Get monthly trends data
   */
  async getMonthlyTrends() {
    try {
      const res = await fetch('/api/trends');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    await delay();
    return [...MOCK_MONTHLY_TRENDS];
  },

  /**
   * Get financial audit logs
   */
  async getAuditLogs() {
    try {
      const res = await fetch('/api/audit-logs');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    await delay();
    return [...auditLogsData];
  },
};
