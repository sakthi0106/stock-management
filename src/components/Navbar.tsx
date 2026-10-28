import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  Building2, 
  ShieldCheck, 
  Users, 
  LogOut, 
  Database,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface NavbarProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onRefresh, isRefreshing }) => {
  const { user, switchRoleQuick, isMockMode, toggleMockMode, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-lg tracking-tight">StockGuard Enterprise</span>
              {isMockMode ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                  <Sparkles className="w-3 h-3 mr-1 text-amber-600" /> Demo Data Mode
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <Database className="w-3 h-3 mr-1 text-emerald-600" /> Live DB
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">Secure Excel-Integrated Stock Monitoring</p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">

          {/* Quick Manual Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-300"
              title="Refresh Dashboard Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
              Refresh
            </button>
          )}

          {/* Mode Switcher Toggle */}
          <button
            onClick={() => toggleMockMode(!isMockMode)}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
            title="Toggle between mock demonstration and live database"
          >
            {isMockMode ? 'Switch to Live Database' : 'Switch to Demo Mode'}
          </button>

          {/* Role Persona Switcher for Quick Preview */}
          <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
            <span className="text-xs text-slate-500 px-2 font-medium">Role:</span>
            {(['DIRECTOR', 'PURCHASE_TEAM', 'ADMIN'] as UserRole[]).map((r) => {
              const active = user?.role === r;
              const labels: Record<UserRole, string> = {
                DIRECTOR: 'Director',
                PURCHASE_TEAM: 'Purchase',
                ADMIN: 'Admin',
              };
              return (
                <button
                  key={r}
                  onClick={() => switchRoleQuick(r)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    active
                      ? 'bg-white text-blue-700 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {labels[r]}
                </button>
              );
            })}
          </div>

          {/* Current User Pill */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold text-xs border border-blue-200">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="hidden lg:block text-left text-xs leading-tight">
              <p className="font-semibold text-slate-800">{user?.full_name}</p>
              <p className="text-slate-500 capitalize">{user?.role?.toLowerCase().replace('_', ' ')}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
};
