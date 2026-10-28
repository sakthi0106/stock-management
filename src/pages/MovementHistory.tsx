import React, { useState, useEffect } from 'react';
import { StockTransaction } from '../types';
import { ApiClient } from '../services/api';
import { 
  ArrowLeftRight, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Calendar,
  RefreshCw,
  Tag
} from 'lucide-react';

export const MovementHistory: React.FC = () => {
  const [movements, setMovements] = useState<StockTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchCode, setSearchCode] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const fetchMovements = async () => {
    setIsLoading(true);
    try {
      const data = await ApiClient.getMovements({
        product_code: searchCode || undefined,
        transaction_type: typeFilter,
      });
      setMovements(data);
    } catch (err) {
      console.error('Failed to fetch movements:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [typeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMovements();
  };

  // Summaries
  const totalInwardQty = movements
    .filter(m => m.transaction_type === 'INWARD')
    .reduce((sum, m) => sum + m.quantity, 0);

  const totalOutwardQty = movements
    .filter(m => m.transaction_type === 'OUTWARD')
    .reduce((sum, m) => sum + m.quantity, 0);

  return (
    <div className="space-y-4">
      
      {/* Header and Filter Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Stock Movement History</h2>
            <p className="text-xs text-slate-500">
              Audit trail of inward receipts and outward dispatches derived strictly from source workbook records.
            </p>
          </div>

          {/* Aggregate Badges */}
          <div className="flex items-center space-x-3 text-xs">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-medium flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 mr-1" />
              <span>Inward Events: {movements.filter(m => m.transaction_type === 'INWARD').length}</span>
            </span>
            <span className="px-3 py-1 bg-red-50 text-red-800 border border-red-200 rounded-lg font-medium flex items-center space-x-1">
              <TrendingDown className="w-3.5 h-3.5 text-red-600 mr-1" />
              <span>Outward Events: {movements.filter(m => m.transaction_type === 'OUTWARD').length}</span>
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
          <form onSubmit={handleSearch} className="sm:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Product Code (e.g. PRD-1001)..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </form>

          <div className="sm:col-span-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">All Movement Types</option>
              <option value="INWARD">Inward (Receipts)</option>
              <option value="OUTWARD">Outward (Issues / Dispatches)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movement List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
            <p className="text-xs">Loading transaction history...</p>
          </div>
        ) : movements.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-sm">No stock movements found matching query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Product Code & Name</th>
                  <th className="py-3 px-4 text-right">Quantity</th>
                  <th className="py-3 px-4">Supplier / Department</th>
                  <th className="py-3 px-4">PO / Work Order Ref</th>
                  <th className="py-3 px-4">Remarks</th>
                  <th className="py-3 px-4 text-center">Workbook Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {movements.map((m) => {
                  const isInward = m.transaction_type === 'INWARD';
                  return (
                    <tr key={m.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                        {new Date(m.transaction_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isInward ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isInward ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                          {m.transaction_type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block font-mono">{m.product_code}</span>
                        <span className="text-slate-500 text-[11px] truncate max-w-xs block">{m.product_name}</span>
                      </td>
                      <td className={`py-3 px-4 text-right font-bold text-sm ${isInward ? 'text-emerald-700' : 'text-slate-800'}`}>
                        {isInward ? '+' : '-'}{m.quantity} <span className="text-xs font-normal text-slate-500">{m.unit}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {m.supplier_or_recipient || <span className="text-slate-300">&mdash;</span>}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                        {m.reference_no || <span className="text-slate-300">&mdash;</span>}
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                        {m.remarks || <span className="text-slate-300">&mdash;</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          {m.source_sheet}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
