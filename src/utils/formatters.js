import { BUDGET_HEALTH_STATUS } from './constants';

/**
 * Format numbers into Indian Rupee format standard (₹1,50,000)
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format numbers into compact Lakhs / Crores / Thousands (e.g. ₹12.5L, ₹1.2Cr)
 */
export const formatCompactCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const val = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (val >= 10000000) {
    return `${sign}₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    return `${sign}₹${(val / 100000).toFixed(2)} L`;
  }
  if (val >= 1000) {
    return `${sign}₹${(val / 1000).toFixed(1)} K`;
  }
  return `${sign}₹${val}`;
};

/**
 * Format date string to neat Indian format (08 Oct 2026)
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Calculate percent spent
 */
export const calculateUtilization = (spent, allocated) => {
  if (!allocated || allocated <= 0) return 0;
  return Number(((spent / allocated) * 100).toFixed(1));
};

/**
 * Determine health status based on spending threshold
 */
export const getBudgetHealth = (spent, allocated) => {
  const pct = calculateUtilization(spent, allocated);
  if (pct > 100) {
    return {
      status: BUDGET_HEALTH_STATUS.OVERSPENT,
      label: 'Overspent',
      badgeClass: 'bg-red-500/20 text-red-400 border-red-500/30',
      progressClass: 'bg-red-500',
      icon: 'AlertTriangle',
    };
  }
  if (pct >= 90) {
    return {
      status: BUDGET_HEALTH_STATUS.CRITICAL,
      label: 'Critical (>90%)',
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      progressClass: 'bg-rose-500',
      icon: 'AlertCircle',
    };
  }
  if (pct >= 75) {
    return {
      status: BUDGET_HEALTH_STATUS.WARNING,
      label: 'Warning (75-90%)',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      progressClass: 'bg-amber-500',
      icon: 'Info',
    };
  }
  return {
    status: BUDGET_HEALTH_STATUS.NORMAL,
    label: 'Healthy (<75%)',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    progressClass: 'bg-emerald-500',
    icon: 'CheckCircle2',
  };
};
