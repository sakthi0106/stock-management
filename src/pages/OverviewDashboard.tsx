import React, { useState, useEffect } from 'react';
import { DashboardSummary, Product, StockTransaction } from '../types';
import { ApiClient } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  RefreshCw, 
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface OverviewDashboardProps {
  onNavigateTab: (tab: any) => void;
  onSelectProduct: (product: Product) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onNavigateTab, onSelectProduct }) => {
  const { isAdmin } = useAuth();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const summary = await ApiClient.getDashboardSummary();
      setData(summary);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard summary');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const intervalId = window.setInterval(() => fetchDashboard(true), 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm">Loading real-time stock metrics from database...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 text-center space-y-3">
        <AlertOctagon className="w-10 h-10 text-red-600 mx-auto" />
        <h3 className="font-semibold text-lg">Unable to load dashboard</h3>
        <p className="text-sm">{error || 'Unknown error occurred'}</p>
        <button
          onClick={() => fetchDashboard()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Prepare chart data for stock by unit
  const chartData = data.total_stock_by_unit.map(u => ({
    name: u.unit,
    Quantity: u.total_quantity,
    Products: u.product_count,
  }));

  return (
    <div className="space-y-6">

      {/* Freshness / Sync Status Alert Banner */}
      {!data.is_data_fresh ? (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Data Synchronization Warning</p>
              <p className="text-xs text-amber-700">{data.data_freshness_warning}</p>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => onNavigateTab('sync')}
              className="px-3 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 transition"
            >
              Trigger Sync
            </button>
          )}
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200/80 px-4 py-3 rounded-xl flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>Excel Live Sync Active</strong> &mdash; Last synchronized at{' '}
              {data.last_sync_time ? new Date(data.last_sync_time).toLocaleString() : 'Recently'}.
            </span>
          </div>
          <span className="font-medium text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full border border-emerald-300">
            Status: {data.last_sync_status || 'SUCCESS'}
          </span>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Products */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Products</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{data.total_products}</h3>
            <p className="text-xs text-slate-400 mt-1">Distinct stock items tracked</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Healthy Stock */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Adequate Stock</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{data.healthy_stock_count}</h3>
            <p className="text-xs text-emerald-600/80 mt-1">Above minimum threshold</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Low Stock Alerts</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{data.low_stock_count}</h3>
            <p className="text-xs text-amber-600/80 mt-1">At or below threshold</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Depleted / Zero Stock</p>
            <h3 className="text-2xl font-bold text-red-600 mt-1">{data.out_of_stock_count}</h3>
            <p className="text-xs text-red-600/80 mt-1">Requires immediate purchase</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Stock Quantities Grouped Strictly by Unit */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Total Current Stock Grouped by Unit of Measure</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly grouped by compatible units &mdash; incompatible units (e.g. PCS, LTR, KG, MTR) are never combined into a misleading total.
            </p>
          </div>
        </div>

        {/* Unit Breakdown Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {data.total_stock_by_unit.map((u) => (
            <div key={u.unit} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{u.unit} Group</span>
              <div className="text-xl font-bold text-slate-800 mt-1">
                {u.total_quantity.toLocaleString()} <span className="text-xs font-normal text-slate-500">{u.unit}</span>
              </div>
              <span className="text-xs text-slate-500 mt-1 block">{u.product_count} product(s)</span>
            </div>
          ))}
        </div>

        {/* Visual Comparison Chart */}
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="Quantity" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout: Low Stock Alerts & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h4 className="text-sm font-semibold text-slate-900 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Priority Reorder Alerts ({data.low_stock_alerts.length})</span>
            </h4>
            <button
              onClick={() => onNavigateTab('register')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
            >
              View Full Register <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {data.low_stock_alerts.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">All products are currently above minimum threshold.</p>
            ) : (
              data.low_stock_alerts.map((p) => (
                <div 
                  key={p.id} 
                  onClick={() => onSelectProduct(p)}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-xs text-slate-900">{p.product_code}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        p.current_balance <= 0 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.current_balance <= 0 ? 'Depleted' : 'Low Stock'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 truncate max-w-xs">{p.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">{p.current_balance} {p.unit_of_measure}</p>
                    <p className="text-[11px] text-slate-400">Min: {p.min_threshold} {p.unit_of_measure}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Inward & Outward Activity */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h4 className="text-sm font-semibold text-slate-900 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Recent Workbook Movements</span>
            </h4>
            <button
              onClick={() => onNavigateTab('movements')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
            >
              View Full History <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {[...data.recent_inward, ...data.recent_outward]
              .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
              .slice(0, 6)
              .map((txn) => {
                const isInward = txn.transaction_type === 'INWARD';
                return (
                  <div key={txn.id} className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-1.5 rounded-lg ${isInward ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {isInward ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-xs text-slate-900">{txn.product_code}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(txn.transaction_date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate max-w-[220px]">
                          {txn.supplier_or_recipient || txn.reference_no || txn.remarks || 'Standard movement'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold ${isInward ? 'text-emerald-700' : 'text-slate-800'}`}>
                        {isInward ? '+' : '-'}{txn.quantity} {txn.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

      </div>

    </div>
  );
};
