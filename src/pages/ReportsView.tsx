import React, { useState, useEffect } from 'react';
import { ApiClient } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  FileSpreadsheet, 
  Download, 
  DollarSign, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  PieChart as PieIcon,
  RefreshCw,
  Info
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { formatINR } from '../utils/formatCurrency';

export const ReportsView: React.FC = () => {
  const { isDirector, isPurchase } = useAuth();
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const fetchReport = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const data = await ApiClient.getStockReport({
        category: selectedCategory,
      });
      setReportData(data);
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    const intervalId = window.setInterval(() => fetchReport(true), 60_000);
    return () => window.clearInterval(intervalId);
  }, [selectedCategory]);

  const handleExport = (format: 'csv' | 'xlsx') => {
    const url = ApiClient.getExportUrl(format, {
      category: selectedCategory,
    });
    window.open(url, '_blank');
  };

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  // Aggregate category breakdown for pie chart
  const categoryMap: Record<string, number> = {};
  if (reportData?.items) {
    reportData.items.forEach((item: any) => {
      categoryMap[item.category] = (categoryMap[item.category] || 0) + 1;
    });
  }

  const pieData = Object.entries(categoryMap).map(([cat, count]) => ({
    name: cat,
    value: count,
  }));

  return (
    <div className="space-y-6">

      {/* Header & Export Actions */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Executive Stock & Valuation Reports</h2>
          <p className="text-xs text-slate-500">
            Review Indian-rupee valuations from unit prices in Excel. Items without a recorded price are excluded from valuation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleExport('csv')}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            Export CSV
          </button>
          <button
            onClick={() => handleExport('xlsx')}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Valuation Notice Banner */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start space-x-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">Price source:</strong> Excel unit prices are treated as Indian rupees (INR). Items without a valid workbook price are marked unavailable and excluded from totals; no prices are estimated.
        </div>
      </div>

      {/* Financial Valuation KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Total Stock Valuation (INR)</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            {reportData?.total_valuation !== null && reportData?.total_valuation !== undefined
              ? formatINR(reportData.total_valuation)
              : 'Cost Data Not in Workbook'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {reportData?.valuation_tracked_count || 0} items with cost recorded
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Report Items</span>
          <h3 className="text-2xl font-bold text-blue-600 mt-1">{reportData?.total_items || 0}</h3>
          <p className="text-xs text-slate-400 mt-1">In selected filter scope</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Low Stock / Reorder</span>
          <h3 className="text-2xl font-bold text-amber-600 mt-1">
            {reportData?.items?.filter((i: any) => i.status !== 'HEALTHY').length || 0}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Products below safety stock</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Price and Valuation by Material</h3>
          <p className="text-xs text-slate-500 mt-1">
            Stock value is current stock multiplied by the unit price from Excel.
          </p>
        </div>
        {isLoading ? (
          <p className="p-8 text-center text-xs text-slate-500">Loading material prices...</p>
        ) : !reportData?.items?.length ? (
          <p className="p-8 text-center text-xs text-slate-500">No materials found in this report.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Material</th>
                  <th className="py-3 px-4">Product Code</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Unit Price (INR)</th>
                  <th className="py-3 px-4 text-right">Current Stock</th>
                  <th className="py-3 px-4 text-right">Stock Value (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {reportData.items.map((item: {
                  product_code: string;
                  product_name: string;
                  category: string;
                  unit: string;
                  unit_cost: number | null;
                  current_balance: number;
                  stock_value: number | null;
                }) => (
                  <tr key={item.product_code} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{item.product_name}</td>
                    <td className="py-3 px-4 font-mono">{item.product_code}</td>
                    <td className="py-3 px-4 text-slate-500">{item.category}</td>
                    <td className="py-3 px-4 text-right">
                      {item.unit_cost !== null ? formatINR(item.unit_cost) : 'Price not provided'}
                    </td>
                    <td className="py-3 px-4 text-right">{item.current_balance.toLocaleString('en-IN')} {item.unit}</td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {item.stock_value !== null ? formatINR(item.stock_value) : 'Not valued'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Chart: Category Distribution */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <PieIcon className="w-4 h-4 text-blue-600" />
          <span>Product Catalog Distribution by Category</span>
        </h3>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
