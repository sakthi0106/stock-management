import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Boxes, 
  ArrowLeftRight, 
  FileSpreadsheet, 
  RefreshCw, 
  Users, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export type TabType = 'overview' | 'register' | 'movements' | 'reports' | 'sync' | 'admin';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user, isAdmin } = useAuth();

  const navItems: { id: TabType; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
    { id: 'overview', label: 'Overview Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'register', label: 'Stock Register', icon: <Boxes className="w-5 h-5" /> },
    { id: 'movements', label: 'Stock Movements', icon: <ArrowLeftRight className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports & Export', icon: <FileSpreadsheet className="w-5 h-5" /> },
    { id: 'sync', label: 'Excel Sync & Mapping', icon: <RefreshCw className="w-5 h-5" />, adminOnly: true },
    { id: 'admin', label: 'User Admin & Audits', icon: <Users className="w-5 h-5" />, adminOnly: true },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Main Menu
        </div>
        
        {navItems.map((item) => {
          const isRestricted = item.adminOnly && !isAdmin;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (!isRestricted) {
                  setActiveTab(item.id);
                }
              }}
              disabled={isRestricted}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600 pl-2.5'
                  : isRestricted
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={isActive ? 'text-blue-600' : isRestricted ? 'text-slate-300' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.adminOnly && (
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                  Admin
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Access Permission Info Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600">
        <div className="flex items-center space-x-2 text-slate-800 font-semibold mb-1">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          <span>Access Level</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
          Logged in as <strong className="text-slate-700">{user?.role}</strong>. Stock data is strictly read-only to preserve Excel workbook integrity.
        </p>
        <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-1.5 flex justify-between">
          <span>Excel sync:</span>
          <span className="font-medium text-emerald-600">Read-Only</span>
        </div>
      </div>
    </aside>
  );
};
