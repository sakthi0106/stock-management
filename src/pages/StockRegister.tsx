import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ApiClient } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  ChevronDown, 
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Eye,
  FileSpreadsheet
} from 'lucide-react';

interface StockRegisterProps {
  onSelectProduct: (product: Product) => void;
}

export const StockRegister: React.FC<StockRegisterProps> = ({ onSelectProduct }) => {
  const { isDirector, isPurchase, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<keyof Product>('product_code');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  const fetchData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        ApiClient.getProducts({
          search: search || undefined,
          category: categoryFilter,
          status: statusFilter,
        }),
        ApiClient.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Error fetching stock register:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = window.setInterval(() => fetchData(true), 60_000);
    return () => window.clearInterval(intervalId);
  }, [categoryFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    const aVal = a[sortField] ?? '';
    const bVal = b[sortField] ?? '';
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = (format: 'csv' | 'xlsx') => {
    const url = ApiClient.getExportUrl(format, {
      category: categoryFilter,
      status: statusFilter,
    });
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      
      {/* Header and Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Stock Register</h2>
            <p className="text-xs text-slate-500">Live inventory balances synchronized from Excel workbook.</p>
          </div>

          {/* Export Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport('csv')}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-sm"
              title="Export filtered records as CSV"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Export CSV
            </button>
            <button
              onClick={() => handleExport('xlsx')}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
              title="Export formatted report as Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
              Export Excel
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
          
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="sm:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by code or product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </form>

          {/* Category Dropdown */}
          <div className="sm:col-span-4">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">All Stock Statuses</option>
              <option value="HEALTHY">Adequate Stock</option>
              <option value="LOW_STOCK">Low Stock Alert</option>
              <option value="OUT_OF_STOCK">Depleted / Zero Stock</option>
            </select>
          </div>

        </div>
      </div>

      {/* Products Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
            <p className="text-xs">Loading stock register...</p>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-sm">No products found matching the selected filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th 
                    onClick={() => handleSort('product_code')}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Product Code</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('name')}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Product Name</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Unit</th>
                  <th className="py-3 px-4 text-right">Opening</th>
                  <th className="py-3 px-4 text-right">Total Inward</th>
                  <th className="py-3 px-4 text-right">Total Outward</th>
                  <th 
                    onClick={() => handleSort('current_balance')}
                    className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Current Balance</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">Min Threshold</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedProducts.map((p) => {
                  let badge = (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Healthy
                    </span>
                  );

                  if (p.status === 'OUT_OF_STOCK') {
                    badge = (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-800 border border-red-300">
                        <AlertOctagon className="w-3 h-3 mr-1" /> Depleted
                      </span>
                    );
                  } else if (p.status === 'LOW_STOCK') {
                    badge = (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Low Stock
                      </span>
                    );
                  }

                  return (
                    <tr 
                      key={p.id} 
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="py-3 px-4 font-bold text-slate-900 font-mono">{p.product_code}</td>
                      <td className="py-3 px-4 font-medium text-slate-800 max-w-xs truncate">{p.name}</td>
                      <td className="py-3 px-4 text-slate-500">{p.category}</td>
                      <td className="py-3 px-4 text-center font-semibold text-slate-600">{p.unit_of_measure}</td>
                      <td className="py-3 px-4 text-right text-slate-500">{p.opening_stock}</td>
                      <td className="py-3 px-4 text-right text-emerald-600 font-medium">+{p.total_inward}</td>
                      <td className="py-3 px-4 text-right text-red-600 font-medium">-{p.total_outward}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 text-sm">
                        {p.current_balance}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500">{p.min_threshold}</td>
                      <td className="py-3 px-4 text-center">{badge}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onSelectProduct(p)}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition"
                          title="View product details & movements"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedProducts.length)} of {sortedProducts.length} products
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded border border-slate-200 disabled:opacity-50 hover:bg-slate-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`px-2.5 py-1 rounded text-xs font-medium ${
                    currentPage === pg ? 'bg-blue-600 text-white' : 'border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {pg}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded border border-slate-200 disabled:opacity-50 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
