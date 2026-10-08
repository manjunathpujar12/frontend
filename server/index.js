import express from 'express';
import cors from 'cors';
import { initDB, dbAll, dbGet, dbRun } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database on server start
initDB()
  .then(() => {
    console.log('Database initialized successfully.');
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
  });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Helper to format department category breakdown
const formatDept = (dept) => {
  if (!dept) return null;
  return {
    ...dept,
    categoryBreakdown: typeof dept.categoryBreakdown === 'string'
      ? JSON.parse(dept.categoryBreakdown || '[]')
      : (dept.categoryBreakdown || [])
  };
};

// 1. College Overall Summary
app.get('/api/summary', async (req, res) => {
  try {
    const rawDepts = await dbAll('SELECT * FROM departments');
    const depts = rawDepts.map(formatDept);
    const rawRequests = await dbAll('SELECT * FROM budget_requests');

    const totalAllocated = depts.reduce((acc, d) => acc + d.allocatedBudget, 0);
    const totalSpent = depts.reduce((acc, d) => acc + d.spentAmount, 0);
    const totalCommitted = depts.reduce((acc, d) => acc + d.committedAmount, 0);
    const remainingBudget = totalAllocated - totalSpent;

    const overspentCount = depts.filter(
      (d) => (d.spentAmount / d.allocatedBudget) > 1.0
    ).length;

    const warningCount = depts.filter((d) => {
      const ratio = d.spentAmount / d.allocatedBudget;
      return ratio >= 0.75 && ratio <= 1.0;
    }).length;

    const pendingRequestsCount = rawRequests.filter(
      (r) => r.status === 'PENDING'
    ).length;

    res.json({
      totalAllocated,
      totalSpent,
      totalCommitted,
      remainingBudget,
      utilizationPercentage: Number(((totalSpent / (totalAllocated || 1)) * 100).toFixed(1)),
      departmentsCount: depts.length,
      overspentCount,
      warningCount,
      pendingRequestsCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get All Departments
app.get('/api/departments', async (req, res) => {
  try {
    const rawDepts = await dbAll('SELECT * FROM departments');
    const depts = rawDepts.map(formatDept);
    res.json(depts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get Single Department
app.get('/api/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rawDept = await dbGet(
      'SELECT * FROM departments WHERE id = ? OR code = ?',
      [id, id]
    );
    if (!rawDept) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json(formatDept(rawDept));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Update Department Allocation (College Admin)
app.patch('/api/departments/:id/allocation', async (req, res) => {
  try {
    const { id } = req.params;
    const { allocatedBudget } = req.body;

    const rawDept = await dbGet(
      'SELECT * FROM departments WHERE id = ? OR code = ?',
      [id, id]
    );
    if (!rawDept) {
      return res.status(404).json({ error: 'Department not found' });
    }

    const oldAllocated = rawDept.allocatedBudget;
    const newAllocated = Number(allocatedBudget);

    await dbRun(
      'UPDATE departments SET allocatedBudget = ? WHERE id = ?',
      [newAllocated, rawDept.id]
    );

    // Audit Log
    const logId = `log-${Date.now()}`;
    const timestamp = new Date().toLocaleString();
    await dbRun(
      `INSERT INTO audit_logs (id, timestamp, user, role, action, details, ip) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        logId,
        timestamp,
        'College Administrator',
        'COLLEGE_ADMIN',
        'Updated Department Allocation',
        `Adjusted baseline budget for ${rawDept.code} from ₹${oldAllocated} to ₹${newAllocated}`,
        '192.168.1.1'
      ]
    );

    const updatedDept = await dbGet('SELECT * FROM departments WHERE id = ?', [rawDept.id]);
    res.json(formatDept(updatedDept));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Get Expenses (with optional filters)
app.get('/api/expenses', async (req, res) => {
  try {
    const { deptId, category, search } = req.query;
    let sql = 'SELECT * FROM expenses WHERE 1=1';
    const params = [];

    if (deptId) {
      sql += ' AND (deptId = ? OR deptCode = ?)';
      params.push(deptId, deptId);
    }

    if (category && category !== 'ALL') {
      sql += ' AND category = ?';
      params.push(category);
    }

    let rows = await dbAll(sql + ' ORDER BY date DESC, id DESC', params);

    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.vendor.toLowerCase().includes(q) ||
          e.deptCode.toLowerCase().includes(q)
      );
    }

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Add New Expense (Department Admin)
app.post('/api/expenses', async (req, res) => {
  try {
    const {
      deptId,
      deptCode,
      title,
      category,
      amount,
      date,
      vendor,
      paymentMethod,
      submittedBy,
      notes,
    } = req.body;

    const id = `exp-${Date.now()}`;
    const expDate = date || new Date().toISOString().split('T')[0];
    const expAmount = Number(amount);

    await dbRun(
      `INSERT INTO expenses (id, deptId, deptCode, title, category, amount, date, vendor, paymentMethod, status, receiptUrl, submittedBy, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        deptId,
        deptCode,
        title,
        category,
        expAmount,
        expDate,
        vendor || 'Vendor Inc',
        paymentMethod || 'Bank Transfer',
        'APPROVED',
        'receipt_standard.pdf',
        submittedBy || 'Department Admin',
        notes || '',
      ]
    );

    // Update target department spentAmount and categoryBreakdown
    const rawDept = await dbGet(
      'SELECT * FROM departments WHERE id = ? OR code = ?',
      [deptId, deptCode]
    );

    if (rawDept) {
      const deptObj = formatDept(rawDept);
      deptObj.spentAmount += expAmount;

      const catIdx = deptObj.categoryBreakdown.findIndex((c) => c.category === category);
      if (catIdx >= 0) {
        deptObj.categoryBreakdown[catIdx].amount += expAmount;
      } else {
        deptObj.categoryBreakdown.push({ category, amount: expAmount });
      }

      await dbRun(
        `UPDATE departments SET spentAmount = ?, categoryBreakdown = ? WHERE id = ?`,
        [deptObj.spentAmount, JSON.stringify(deptObj.categoryBreakdown), deptObj.id]
      );
    }

    // Insert Audit Log
    const logId = `log-${Date.now()}`;
    const timestamp = new Date().toLocaleString();
    await dbRun(
      `INSERT INTO audit_logs (id, timestamp, user, role, action, details, ip) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        logId,
        timestamp,
        submittedBy || 'Department Admin',
        'DEPARTMENT_ADMIN',
        'Logged New Expense',
        `Added expense ₹${expAmount} for ${title}`,
        '192.168.1.100',
      ]
    );

    const createdExpense = await dbGet('SELECT * FROM expenses WHERE id = ?', [id]);
    res.status(201).json(createdExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Get Budget Requests
app.get('/api/budget-requests', async (req, res) => {
  try {
    const { deptId } = req.query;
    let sql = 'SELECT * FROM budget_requests';
    const params = [];

    if (deptId) {
      sql += ' WHERE deptId = ? OR deptCode = ?';
      params.push(deptId, deptId);
    }

    sql += ' ORDER BY createdAt DESC, id DESC';
    const rows = await dbAll(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Submit Budget Request
app.post('/api/budget-requests', async (req, res) => {
  try {
    const {
      deptId,
      deptCode,
      deptName,
      title,
      amountRequested,
      category,
      justification,
      urgency,
      requestedBy,
    } = req.body;

    const id = `req-${Date.now()}`;
    const createdAt = new Date().toISOString().split('T')[0];
    const amount = Number(amountRequested);

    await dbRun(
      `INSERT INTO budget_requests (id, deptId, deptCode, deptName, title, amountRequested, category, justification, urgency, status, createdAt, requestedBy)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        deptId,
        deptCode,
        deptName,
        title,
        amount,
        category,
        justification,
        urgency || 'MEDIUM',
        'PENDING',
        createdAt,
        requestedBy || 'HOD User',
      ]
    );

    // Audit Log
    const logId = `log-${Date.now()}`;
    const timestamp = new Date().toLocaleString();
    await dbRun(
      `INSERT INTO audit_logs (id, timestamp, user, role, action, details, ip) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        logId,
        timestamp,
        requestedBy || 'HOD User',
        'DEPARTMENT_ADMIN',
        'Submitted Budget Request',
        `Requested additional budget ₹${amount} for ${title}`,
        '192.168.1.100',
      ]
    );

    const createdReq = await dbGet('SELECT * FROM budget_requests WHERE id = ?', [id]);
    res.status(201).json(createdReq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Approve Budget Request
app.post('/api/budget-requests/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { adminName = 'Dean / Principal' } = req.body;

    const reqItem = await dbGet('SELECT * FROM budget_requests WHERE id = ?', [id]);
    if (!reqItem) {
      return res.status(404).json({ error: 'Budget request not found' });
    }

    const approvedAt = new Date().toISOString().split('T')[0];
    await dbRun(
      `UPDATE budget_requests SET status = 'APPROVED', approvedAt = ?, approvedBy = ? WHERE id = ?`,
      [approvedAt, adminName, id]
    );

    // Increase target department's allocated budget
    const targetDept = await dbGet(
      'SELECT * FROM departments WHERE id = ? OR code = ?',
      [reqItem.deptId, reqItem.deptCode]
    );
    if (targetDept) {
      const newAllocated = targetDept.allocatedBudget + reqItem.amountRequested;
      await dbRun(
        'UPDATE departments SET allocatedBudget = ? WHERE id = ?',
        [newAllocated, targetDept.id]
      );
    }

    // Audit Log
    const logId = `log-${Date.now()}`;
    const timestamp = new Date().toLocaleString();
    await dbRun(
      `INSERT INTO audit_logs (id, timestamp, user, role, action, details, ip) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        logId,
        timestamp,
        adminName,
        'COLLEGE_ADMIN',
        'Approved Budget Request',
        `Approved ₹${reqItem.amountRequested} for ${reqItem.deptCode} - ${reqItem.title}`,
        '192.168.1.1',
      ]
    );

    const updatedReq = await dbGet('SELECT * FROM budget_requests WHERE id = ?', [id]);
    res.json(updatedReq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Reject Budget Request
app.post('/api/budget-requests/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = 'Insufficient overall funds', adminName = 'Dean / Principal' } = req.body;

    const reqItem = await dbGet('SELECT * FROM budget_requests WHERE id = ?', [id]);
    if (!reqItem) {
      return res.status(404).json({ error: 'Budget request not found' });
    }

    const rejectedAt = new Date().toISOString().split('T')[0];
    await dbRun(
      `UPDATE budget_requests SET status = 'REJECTED', rejectedAt = ?, rejectionReason = ? WHERE id = ?`,
      [rejectedAt, reason, id]
    );

    // Audit Log
    const logId = `log-${Date.now()}`;
    const timestamp = new Date().toLocaleString();
    await dbRun(
      `INSERT INTO audit_logs (id, timestamp, user, role, action, details, ip) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        logId,
        timestamp,
        adminName,
        'COLLEGE_ADMIN',
        'Rejected Budget Request',
        `Rejected ₹${reqItem.amountRequested} for ${reqItem.deptCode}. Reason: ${reason}`,
        '192.168.1.1',
      ]
    );

    const updatedReq = await dbGet('SELECT * FROM budget_requests WHERE id = ?', [id]);
    res.json(updatedReq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Monthly Trends
app.get('/api/trends', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM monthly_trends ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 12. Audit Logs
app.get('/api/audit-logs', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM audit_logs ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start express server
app.listen(PORT, () => {
  console.log(`🚀 Budget Management Backend Server running on http://localhost:${PORT}`);
});
