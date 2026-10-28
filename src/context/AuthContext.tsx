import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthState } from '../types';
import { ApiClient } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRoleQuick: (role: UserRole) => Promise<void>;
  toggleMockMode: (active: boolean) => void;
  isDirector: boolean;
  isPurchase: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(ApiClient.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMockMode, setIsMockMode] = useState<boolean>(ApiClient.getMockMode());

  const initAuth = async () => {
    setIsLoading(true);
    try {
      const storedToken = ApiClient.getToken();
      if (storedToken) {
        const profile = await ApiClient.getMe();
        setUser(profile);
      } else {
        // Default auto-login to Director for effortless first-time exploration
        await switchRoleQuick('DIRECTOR');
      }
    } catch (err) {
      console.warn('Auto auth failed or session expired, logging in as Director demo:', err);
      await switchRoleQuick('DIRECTOR');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initAuth();

    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth_unauthorized', handleUnauthorized);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await ApiClient.login(email, password);
      setUser(res.user);
      setToken(res.access_token);
    } finally {
      setIsLoading(false);
    }
  };

  const switchRoleQuick = async (role: UserRole) => {
    setIsLoading(true);
    try {
      let email = 'director@company.internal';
      let pass = 'DirectorPass2026!';
      if (role === 'PURCHASE_TEAM') {
        email = 'purchase@company.internal';
        pass = 'PurchasePass2026!';
      } else if (role === 'ADMIN') {
        email = 'admin@company.internal';
        pass = 'AdminPass2026!';
      }
      await login(email, pass);
    } catch (err) {
      console.error('Failed to switch role:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    ApiClient.setToken(null);
    setUser(null);
    setToken(null);
  };

  const toggleMockMode = (active: boolean) => {
    ApiClient.setMockMode(active);
    setIsMockMode(active);
    // Refresh current user view
    initAuth();
  };

  const isDirector = user?.role === 'DIRECTOR' || user?.role === 'ADMIN';
  const isPurchase = user?.role === 'PURCHASE_TEAM' || user?.role === 'ADMIN';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isMockMode,
        login,
        logout,
        switchRoleQuick,
        toggleMockMode,
        isDirector,
        isPurchase,
        isAdmin,
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
