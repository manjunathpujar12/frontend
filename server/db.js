import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'database.sqlite');

const verboseSqlite = sqlite3.verbose();
export const db = new verboseSqlite.Database(dbPath);

// Promisified DB query helpers
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Initial Seed Data
const MOCK_DEPARTMENTS = [
  {
    id: 'dept-1',
    code: 'CSE',
    name: 'Computer Science & Engineering',
    hodName: 'Dr. A. Sharma',
    hodEmail: 'hod.cse@college.edu',
    allocatedBudget: 5000000,
    spentAmount: 4450000,
    committedAmount: 250000,
    categoryBreakdown: JSON.stringify([
      { category: 'Lab Equipment', amount: 2100000 },
      { category: 'Software Licenses', amount: 950000 },
      { category: 'Research & Grants', amount: 800000 },
      { category: 'Student Hackathons', amount: 400000 },
      { category: 'Maintenance & Repairs', amount: 200000 },
    ]),
  },
  {
    id: 'dept-2',
    code: 'ECE',
    name: 'Electronics & Communication',
    hodName: 'Dr. R. K. Verma',
    hodEmail: 'hod.ece@college.edu',
    allocatedBudget: 3800000,
    spentAmount: 4120000,
    committedAmount: 180000,
    categoryBreakdown: JSON.stringify([
      { category: 'Lab Equipment', amount: 2200000 },
      { category: 'Research & Grants', amount: 1100000 },
      { category: 'Seminars & Workshops', amount: 420000 },
      { category: 'Maintenance & Repairs', amount: 400000 },
    ]),
  },
  {
    id: 'dept-3',
    code: 'MECH',
    name: 'Mechanical Engineering',
    hodName: 'Dr. S. Nair',
    hodEmail: 'hod.mech@college.edu',
    allocatedBudget: 4500000,
    spentAmount: 3100000,
    committedAmount: 400000,
    categoryBreakdown: JSON.stringify([
      { category: 'Lab Equipment', amount: 1800000 },
      { category: 'Maintenance & Repairs', amount: 700000 },
      { category: 'Faculty Development', amount: 400000 },
      { category: 'Office Supplies', amount: 200000 },
    ]),
  },
  {
    id: 'dept-4',
    code: 'CIVIL',
    name: 'Civil Engineering',
    hodName: 'Dr. P. Gupta',
    hodEmail: 'hod.civil@college.edu',
    allocatedBudget: 3000000,
    spentAmount: 1850000,
    committedAmount: 150000,
    categoryBreakdown: JSON.stringify([
      { category: 'Lab Equipment', amount: 1000000 },
      { category: 'Research & Grants', amount: 500000 },
      { category: 'Office Supplies', amount: 350000 },
    ]),
  },
  {
    id: 'dept-5',
    code: 'BIOTECH',
    name: 'Biotechnology & Bio-Eng',
    hodName: 'Dr. Meera Menon',
    hodEmail: 'hod.biotech@college.edu',
    allocatedBudget: 2800000,
    spentAmount: 2240000,
    committedAmount: 200000,
    categoryBreakdown: JSON.stringify([
      { category: 'Lab Equipment', amount: 1400000 },
      { category: 'Research & Grants', amount: 640000 },
      { category: 'Seminars & Workshops', amount: 200000 },
    ]),
  },
  {
    id: 'dept-6',
    code: 'MBA',
    name: 'School of Management',
    hodName: 'Dr. V. Kapoor',
    hodEmail: 'hod.mba@college.edu',
    allocatedBudget: 2500000,
    spentAmount: 1500000,
    committedAmount: 100000,
    categoryBreakdown: JSON.stringify([
      { category: 'Seminars & Workshops', amount: 800000 },
      { category: 'Faculty Development', amount: 450000 },
      { category: 'Office Supplies', amount: 250000 },
    ]),
  },
];

const MOCK_EXPENSES = [
  {
    id: 'exp-101',
    deptId: 'dept-1',
    deptCode: 'CSE',
    title: 'NVIDIA RTX 4090 Workstations for AI Lab',
    category: 'Lab Equipment',
    amount: 650000,
    date: '2026-09-28',
    vendor: 'Dell Technologies India',
    paymentMethod: 'Bank Transfer',
    status: 'APPROVED',
    receiptUrl: 'receipt_nv_4090.pdf',
    submittedBy: 'Dr. A. Sharma',
    notes: 'Approved under High Performance Computing Grant FY26',
  },
  {
    id: 'exp-102',
    deptId: 'dept-2',
    deptCode: 'ECE',
    title: 'Spectrum Analyzer Calibration & Upgrades',
    category: 'Maintenance & Repairs',
    amount: 280000,
    date: '2026-09-25',
    vendor: 'Keysight Technologies',
    paymentMethod: 'Corporate Card',
    status: 'APPROVED',
    receiptUrl: 'receipt_keysight.pdf',
    submittedBy: 'Dr. R. K. Verma',
    notes: 'Exceeded expected quota due to urgent lab audit',
  },
  {
    id: 'exp-103',
    deptId: 'dept-1',
    deptCode: 'CSE',
    title: 'AWS Cloud Credits & JetBrains Institutional License',
    category: 'Software Licenses',
    amount: 320000,
    date: '2026-09-20',
    vendor: 'Amazon Web Services / JetBrains',
    paymentMethod: 'Net Banking',
    status: 'APPROVED',
    receiptUrl: 'receipt_aws.pdf',
    submittedBy: 'Dr. A. Sharma',
    notes: 'Annual recurring subscription for 300 student accounts',
  },
  {
    id: 'exp-104',
    deptId: 'dept-3',
    deptCode: 'MECH',
    title: '3D Printer Filament & CNC Router Tools',
    category: 'Lab Equipment',
    amount: 145000,
    date: '2026-09-18',
    vendor: 'Sahara Tools & Dies',
    paymentMethod: 'UPI / Cheque',
    status: 'APPROVED',
    receiptUrl: 'receipt_cnc.pdf',
    submittedBy: 'Dr. S. Nair',
    notes: 'Required for final year project prototypes',
  },
  {
    id: 'exp-105',
    deptId: 'dept-1',
    deptCode: 'CSE',
    title: 'National Hackathon Sponsorship & Prize Pool',
    category: 'Student Hackathons',
    amount: 150000,
    date: '2026-09-12',
    vendor: 'Event Management Team',
    paymentMethod: 'Bank Transfer',
    status: 'APPROVED',
    receiptUrl: 'receipt_hackathon.pdf',
    submittedBy: 'Dr. A. Sharma',
    notes: 'Smart India Hackathon internal qualifier edition',
  },
  {
    id: 'exp-106',
    deptId: 'dept-2',
    deptCode: 'ECE',
    title: 'VLSI Chip Prototyping Workshop Kit',
    category: 'Seminars & Workshops',
    amount: 210000,
    date: '2026-09-05',
    vendor: 'Cadence Design Systems',
    paymentMethod: 'Bank Transfer',
    status: 'APPROVED',
    receiptUrl: 'receipt_cadence.pdf',
    submittedBy: 'Dr. R. K. Verma',
    notes: 'Push ECE spending above threshold limit',
  },
  {
    id: 'exp-107',
    deptId: 'dept-5',
    deptCode: 'BIOTECH',
    title: 'Reagents and Centrifuge Replacement Tubes',
    category: 'Lab Equipment',
    amount: 98000,
    date: '2026-08-30',
    vendor: 'Thermo Fisher Scientific',
    paymentMethod: 'Net Banking',
    status: 'APPROVED',
    receiptUrl: 'receipt_thermo.pdf',
    submittedBy: 'Dr. Meera Menon',
    notes: 'Bio-Process laboratory consumables',
  },
];

const MOCK_BUDGET_REQUESTS = [
  {
    id: 'req-201',
    deptId: 'dept-1',
    deptCode: 'CSE',
    deptName: 'Computer Science & Engineering',
    title: 'Additional GPU Compute Node for Research Project',
    amountRequested: 750000,
    category: 'Research & Grants',
    justification: 'Requested to support upcoming ISRO collaborative AI research program. Current lab GPUs are at 100% capacity.',
    urgency: 'HIGH',
    status: 'PENDING',
    createdAt: '2026-10-02',
    requestedBy: 'Dr. A. Sharma (HOD CSE)',
  },
  {
    id: 'req-202',
    deptId: 'dept-2',
    deptCode: 'ECE',
    deptName: 'Electronics & Communication',
    title: 'Emergency Deficit Clearance Grant',
    amountRequested: 500000,
    category: 'Maintenance & Repairs',
    justification: 'ECE department has exceeded allocated budget by ₹3.2L due to mandatory accreditation audit lab upgrades. Requesting top-up allocation.',
    urgency: 'CRITICAL',
    status: 'PENDING',
    createdAt: '2026-10-05',
    requestedBy: 'Dr. R. K. Verma (HOD ECE)',
  },
  {
    id: 'req-203',
    deptId: 'dept-3',
    deptCode: 'MECH',
    deptName: 'Mechanical Engineering',
    title: 'Robotics Workshop Industrial Arm Setup',
    amountRequested: 350000,
    category: 'Lab Equipment',
    justification: 'Required for new Industry 4.0 elective course starting next trimester.',
    urgency: 'MEDIUM',
    status: 'APPROVED',
    createdAt: '2026-09-15',
    approvedAt: '2026-09-20',
    approvedBy: 'College Dean',
    requestedBy: 'Dr. S. Nair (HOD MECH)',
  },
  {
    id: 'req-204',
    deptId: 'dept-6',
    deptCode: 'MBA',
    deptName: 'School of Management',
    title: 'Bloomberg Terminal Annual Access Renewal',
    amountRequested: 200000,
    category: 'Software Licenses',
    justification: 'Finance lab subscription for management students.',
    urgency: 'LOW',
    status: 'REJECTED',
    createdAt: '2026-09-10',
    rejectedAt: '2026-09-14',
    rejectionReason: 'Exceeds non-technical software license ceiling. Please resubmit under general library budget.',
    requestedBy: 'Dr. V. Kapoor (HOD MBA)',
  },
];

const MOCK_MONTHLY_TRENDS = [
  { month: 'Apr', CSE: 350000, ECE: 400000, MECH: 200000, CIVIL: 150000, Total: 1100000 },
  { month: 'May', CSE: 420000, ECE: 380000, MECH: 250000, CIVIL: 180000, Total: 1230000 },
  { month: 'Jun', CSE: 600000, ECE: 550000, MECH: 400000, CIVIL: 300000, Total: 1850000 },
  { month: 'Jul', CSE: 800000, ECE: 700000, MECH: 500000, CIVIL: 400000, Total: 2400000 },
  { month: 'Aug', CSE: 950000, ECE: 900000, MECH: 750000, CIVIL: 350000, Total: 2950000 },
  { month: 'Sep', CSE: 1330000, ECE: 1190000, MECH: 1000000, CIVIL: 470000, Total: 3990000 },
];

const MOCK_AUDIT_LOGS = [
  {
    id: 'log-1',
    timestamp: '2026-10-05 14:32',
    user: 'Dr. R. K. Verma',
    role: 'DEPARTMENT_ADMIN',
    action: 'Submitted Budget Request',
    details: 'Requested ₹5,00,000 Emergency Deficit Clearance Grant for ECE',
    ip: '192.168.1.45',
  },
  {
    id: 'log-2',
    timestamp: '2026-10-02 11:15',
    user: 'Principal Office',
    role: 'COLLEGE_ADMIN',
    action: 'Approved Expense Claim',
    details: 'Approved ₹6,50,000 for NVIDIA RTX Workstations (CSE)',
    ip: '192.168.1.10',
  },
  {
    id: 'log-3',
    timestamp: '2026-09-28 09:40',
    user: 'System Automated Alert',
    role: 'SYSTEM',
    action: 'Overspending Triggered',
    details: 'ECE Department exceeded 100% budget limit (108.4% utilization)',
    ip: 'INTERNAL',
  },
];

// Initialize Database Schemas and Seed Data
export const initDB = async () => {
  // Create tables
  await dbRun(`
    CREATE TABLE IF NOT EXISTS departments (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE,
      name TEXT,
      hodName TEXT,
      hodEmail TEXT,
      allocatedBudget REAL,
      spentAmount REAL,
      committedAmount REAL,
      categoryBreakdown TEXT
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      deptId TEXT,
      deptCode TEXT,
      title TEXT,
      category TEXT,
      amount REAL,
      date TEXT,
      vendor TEXT,
      paymentMethod TEXT,
      status TEXT,
      receiptUrl TEXT,
      submittedBy TEXT,
      notes TEXT
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS budget_requests (
      id TEXT PRIMARY KEY,
      deptId TEXT,
      deptCode TEXT,
      deptName TEXT,
      title TEXT,
      amountRequested REAL,
      category TEXT,
      justification TEXT,
      urgency TEXT,
      status TEXT,
      createdAt TEXT,
      requestedBy TEXT,
      approvedAt TEXT,
      approvedBy TEXT,
      rejectedAt TEXT,
      rejectionReason TEXT
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS monthly_trends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      month TEXT,
      CSE REAL,
      ECE REAL,
      MECH REAL,
      CIVIL REAL,
      Total REAL
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT,
      user TEXT,
      role TEXT,
      action TEXT,
      details TEXT,
      ip TEXT
    )
  `);

  // Check if tables need initial seeding
  const deptCount = await dbGet(`SELECT COUNT(*) as count FROM departments`);
  if (deptCount && deptCount.count === 0) {
    console.log('Seeding initial departments data into SQLite...');
    for (const d of MOCK_DEPARTMENTS) {
      await dbRun(
        `INSERT INTO departments (id, code, name, hodName, hodEmail, allocatedBudget, spentAmount, committedAmount, categoryBreakdown)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [d.id, d.code, d.name, d.hodName, d.hodEmail, d.allocatedBudget, d.spentAmount, d.committedAmount, d.categoryBreakdown]
      );
    }
  }

  const expenseCount = await dbGet(`SELECT COUNT(*) as count FROM expenses`);
  if (expenseCount && expenseCount.count === 0) {
    console.log('Seeding initial expenses data into SQLite...');
    for (const e of MOCK_EXPENSES) {
      await dbRun(
        `INSERT INTO expenses (id, deptId, deptCode, title, category, amount, date, vendor, paymentMethod, status, receiptUrl, submittedBy, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [e.id, e.deptId, e.deptCode, e.title, e.category, e.amount, e.date, e.vendor, e.paymentMethod, e.status, e.receiptUrl, e.submittedBy, e.notes]
      );
    }
  }

  const reqCount = await dbGet(`SELECT COUNT(*) as count FROM budget_requests`);
  if (reqCount && reqCount.count === 0) {
    console.log('Seeding initial budget requests data into SQLite...');
    for (const r of MOCK_BUDGET_REQUESTS) {
      await dbRun(
        `INSERT INTO budget_requests (id, deptId, deptCode, deptName, title, amountRequested, category, justification, urgency, status, createdAt, requestedBy, approvedAt, approvedBy, rejectedAt, rejectionReason)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [r.id, r.deptId, r.deptCode, r.deptName, r.title, r.amountRequested, r.category, r.justification, r.urgency, r.status, r.createdAt, r.requestedBy, r.approvedAt || null, r.approvedBy || null, r.rejectedAt || null, r.rejectionReason || null]
      );
    }
  }

  const trendCount = await dbGet(`SELECT COUNT(*) as count FROM monthly_trends`);
  if (trendCount && trendCount.count === 0) {
    console.log('Seeding initial monthly trends data into SQLite...');
    for (const t of MOCK_MONTHLY_TRENDS) {
      await dbRun(
        `INSERT INTO monthly_trends (month, CSE, ECE, MECH, CIVIL, Total) VALUES (?, ?, ?, ?, ?, ?)`,
        [t.month, t.CSE, t.ECE, t.MECH, t.CIVIL, t.Total]
      );
    }
  }

  const logCount = await dbGet(`SELECT COUNT(*) as count FROM audit_logs`);
  if (logCount && logCount.count === 0) {
    console.log('Seeding initial audit logs data into SQLite...');
    for (const l of MOCK_AUDIT_LOGS) {
      await dbRun(
        `INSERT INTO audit_logs (id, timestamp, user, role, action, details, ip) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [l.id, l.timestamp, l.user, l.role, l.action, l.details, l.ip]
      );
    }
  }
};
