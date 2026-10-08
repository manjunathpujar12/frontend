import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/auth/LoginPage';
import { CollegeDashboardPage } from './pages/college/CollegeDashboardPage';
import { DepartmentListPage } from './pages/college/DepartmentListPage';
import { BudgetAllocationPage } from './pages/college/BudgetAllocationPage';
import { AllRequestsPage } from './pages/college/AllRequestsPage';
import { AuditLogsPage } from './pages/college/AuditLogsPage';
import { DepartmentDashboardPage } from './pages/department/DepartmentDashboardPage';
import { ExpensesPage } from './pages/department/ExpensesPage';
import { RequestBudgetPage } from './pages/department/RequestBudgetPage';
import { CategoryBreakdownPage } from './pages/department/CategoryBreakdownPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { ROLES } from './utils/constants';

const AppContent = () => {
  const { isAuthenticated, currentRole } = useAuth();
  const [currentPath, setCurrentPath] = useState('/college/dashboard');

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={(role, deptId) => {
          if (role === ROLES.DEPARTMENT_ADMIN) {
            setCurrentPath('/department/dashboard');
          } else {
            setCurrentPath('/college/dashboard');
          }
        }}
      />
    );
  }

  // Render appropriate view with strict security isolation
  const renderPage = () => {
    // If Department Admin tries to access College or Admin path, redirect strictly to their department view
    if (currentRole === ROLES.DEPARTMENT_ADMIN && !currentPath.startsWith('/department')) {
      return <DepartmentDashboardPage onNavigate={setCurrentPath} />;
    }

    switch (currentPath) {
      // College Admin Routes (Accessible ONLY by COLLEGE_ADMIN)
      case '/college/dashboard':
        return <CollegeDashboardPage onNavigate={setCurrentPath} />;
      case '/college/departments':
        return <DepartmentListPage onNavigate={setCurrentPath} />;
      case '/college/allocations':
        return <BudgetAllocationPage />;
      case '/college/requests':
        return <AllRequestsPage />;
      case '/college/audit-logs':
        return <AuditLogsPage />;

      // Department Admin Routes
      case '/department/dashboard':
        return <DepartmentDashboardPage onNavigate={setCurrentPath} />;
      case '/department/expenses':
        return <ExpensesPage />;
      case '/department/requests':
        return <RequestBudgetPage />;
      case '/department/categories':
        return <CategoryBreakdownPage />;

      // System Settings (College Admin Only)
      case '/admin/settings':
        return currentRole === ROLES.COLLEGE_ADMIN ? (
          <SettingsPage />
        ) : (
          <DepartmentDashboardPage onNavigate={setCurrentPath} />
        );

      default:
        return currentRole === ROLES.DEPARTMENT_ADMIN ? (
          <DepartmentDashboardPage onNavigate={setCurrentPath} />
        ) : (
          <CollegeDashboardPage onNavigate={setCurrentPath} />
        );
    }
  };

  return (
    <Layout activePath={currentPath} onNavigate={setCurrentPath}>
      {renderPage()}
    </Layout>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
