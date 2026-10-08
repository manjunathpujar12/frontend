import React, { createContext, useContext, useState } from 'react';
import { ROLES, DEPARTMENTS } from '../utils/constants';

const AuthContext = createContext(null);

const MOCK_USERS = {
  [ROLES.COLLEGE_ADMIN]: {
    id: 'user-admin',
    name: 'Dr. Vikram Malhotra',
    email: 'principal@college.edu',
    role: ROLES.COLLEGE_ADMIN,
    title: 'Principal & Chief Financial Trustee',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  'dept-1': {
    id: 'user-cse-hod',
    name: 'Dr. A. Sharma',
    email: 'hod.cse@college.edu',
    role: ROLES.DEPARTMENT_ADMIN,
    title: 'HOD - Computer Science & Engineering',
    deptId: 'dept-1',
    deptCode: 'CSE',
    deptName: 'Computer Science & Engineering',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  'dept-2': {
    id: 'user-ece-hod',
    name: 'Dr. R. K. Verma',
    email: 'hod.ece@college.edu',
    role: ROLES.DEPARTMENT_ADMIN,
    title: 'HOD - Electronics & Communication',
    deptId: 'dept-2',
    deptCode: 'ECE',
    deptName: 'Electronics & Communication',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  'dept-3': {
    id: 'user-mech-hod',
    name: 'Dr. S. Nair',
    email: 'hod.mech@college.edu',
    role: ROLES.DEPARTMENT_ADMIN,
    title: 'HOD - Mechanical Engineering',
    deptId: 'dept-3',
    deptCode: 'MECH',
    deptName: 'Mechanical Engineering',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [selectedDeptId, setSelectedDeptIdState] = useState('dept-1');
  const [user, setUser] = useState(null);

  const login = (email, password, role = ROLES.COLLEGE_ADMIN, targetDeptId = 'dept-1') => {
    setCurrentRole(role);
    if (role === ROLES.DEPARTMENT_ADMIN) {
      setSelectedDeptIdState(targetDeptId);
      const deptUser = MOCK_USERS[targetDeptId] || {
        id: `user-${targetDeptId}`,
        name: `HOD ${targetDeptId.toUpperCase()}`,
        email: email || `hod.${targetDeptId}@college.edu`,
        role: ROLES.DEPARTMENT_ADMIN,
        title: `Head of Department (${targetDeptId.toUpperCase()})`,
        deptId: targetDeptId,
        deptCode: targetDeptId.toUpperCase(),
        deptName: `Department ${targetDeptId}`,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      };
      setUser(deptUser);
    } else {
      setSelectedDeptIdState('dept-1');
      setUser(MOCK_USERS[ROLES.COLLEGE_ADMIN]);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentRole(null);
    setSelectedDeptIdState('dept-1');
  };

  // Allow updating selected department ID
  const setSelectedDeptId = (deptId) => {
    setSelectedDeptIdState(deptId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentRole,
        selectedDeptId: selectedDeptId || 'dept-1',
        setSelectedDeptId,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
