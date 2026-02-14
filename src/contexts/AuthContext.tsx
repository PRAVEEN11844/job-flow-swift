import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole, phone: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mockUsers: Record<UserRole, User> = {
  customer: { id: 'c1', name: 'Ravi Enterprises', phone: '9876500001', role: 'customer' },
  worker: { id: 'w1', name: 'Rajesh Kumar', phone: '9876543210', role: 'worker' },
  admin: { id: 'admin', name: 'Admin', phone: '9876500000', role: 'admin' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hanvika_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((role: UserRole, phone: string) => {
    const u = { ...mockUsers[role], phone };
    setUser(u);
    localStorage.setItem('hanvika_user', JSON.stringify(u));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('hanvika_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
