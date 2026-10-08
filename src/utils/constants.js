export const ROLES = {
  COLLEGE_ADMIN: 'COLLEGE_ADMIN',
  DEPARTMENT_ADMIN: 'DEPARTMENT_ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

export const ROLE_LABELS = {
  COLLEGE_ADMIN: 'College Administrator (Dean / Principal)',
  DEPARTMENT_ADMIN: 'Department Head (HOD)',
  SUPER_ADMIN: 'Finance Trustee / Super Admin',
};

export const DEPARTMENTS = [
  { id: 'dept-1', code: 'CSE', name: 'Computer Science & Engineering', icon: 'Laptop' },
  { id: 'dept-2', code: 'ECE', name: 'Electronics & Communication', icon: 'Cpu' },
  { id: 'dept-3', code: 'MECH', name: 'Mechanical Engineering', icon: 'Wrench' },
  { id: 'dept-4', code: 'CIVIL', name: 'Civil Engineering', icon: 'Building' },
  { id: 'dept-5', code: 'BIOTECH', name: 'Biotechnology & Bio-Eng', icon: 'Dna' },
  { id: 'dept-6', code: 'MBA', name: 'School of Management', icon: 'Briefcase' },
];

export const EXPENSE_CATEGORIES = [
  'Lab Equipment',
  'Research & Grants',
  'Seminars & Workshops',
  'Software Licenses',
  'Maintenance & Repairs',
  'Faculty Development',
  'Student Hackathons',
  'Office Supplies',
];

export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
};

export const BUDGET_HEALTH_STATUS = {
  NORMAL: 'NORMAL',      // 0 - 75%
  WARNING: 'WARNING',    // 75% - 90%
  CRITICAL: 'CRITICAL',  // 90% - 100%
  OVERSPENT: 'OVERSPENT' // > 100%
};

export const FISCAL_YEAR = '2025 - 2026';
