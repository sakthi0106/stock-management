import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { OverviewDashboard } from './pages/OverviewDashboard';
import { StockRegister } from './pages/StockRegister';
import { MovementHistory } from './pages/MovementHistory';
import { ReportsView } from './pages/ReportsView';
import { SyncManagement } from './pages/SyncManagement';
import { AdminUsers } from './pages/AdminUsers';
import { ProductDetailModal } from './pages/ProductDetailModal';
import { Product } from './types';
import { RefreshCw, Lock } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-semibold text-slate-600">Initializing StockGuard Enterprise...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Application Bar */}
      <Navbar onRefresh={handleManualRefresh} isRefreshing={isRefreshing} />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewDashboard 
              key={refreshTrigger}
              onNavigateTab={setActiveTab}
              onSelectProduct={setSelectedProduct}
            />
          )}

          {activeTab === 'register' && (
            <StockRegister 
              key={refreshTrigger}
              onSelectProduct={setSelectedProduct}
            />
          )}

          {activeTab === 'movements' && (
            <MovementHistory key={refreshTrigger} />
          )}

          {activeTab === 'reports' && (
            <ReportsView key={refreshTrigger} />
          )}

          {activeTab === 'sync' && (
            <SyncManagement key={refreshTrigger} />
          )}

          {activeTab === 'admin' && (
            <AdminUsers key={refreshTrigger} />
          )}
        </main>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
