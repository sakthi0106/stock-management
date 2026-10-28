import React, { useState, useEffect } from 'react';
import { Product, StockTransaction } from '../types';
import { ApiClient } from '../services/api';
import { 
  X, 
  Package, 
  MapPin, 
  Clock, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  FileSpreadsheet,
  AlertOctagon
} from 'lucide-react';
import { formatINR } from '../utils/formatCurrency';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const [details, setDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!product) return;
    const loadDetails = async () => {
      setIsLoading(true);
      try {
        const res = await ApiClient.getProductDetails(product.id);
        setDetails(res);
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDetails();
  }, [product]);

  if (!product) return null;

  const currentProd = details || product;
  const isLowStock = currentProd.min_threshold > 0 && currentProd.current_balance <= currentProd.min_threshold;
  const isOutOfStock = currentProd.current_balance <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-slate-900">{currentProd.product_code}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                  {currentProd.category}
                </span>
                {isOutOfStock ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold border border-red-300">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
                    Low Stock Alert
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                    Adequate Stock
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{currentProd.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Balance Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
              <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider block">Current Balance</span>
              <span className="text-2xl font-black text-blue-900 mt-1 block">
                {currentProd.current_balance} <span className="text-xs font-medium text-blue-700">{currentProd.unit_of_measure}</span>
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Opening Stock</span>
              <span className="text-xl font-bold text-slate-800 mt-1 block">
                {currentProd.opening_stock} <span className="text-xs font-medium text-slate-500">{currentProd.unit_of_measure}</span>
              </span>
            </div>

            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">Total Inward</span>
              <span className="text-xl font-bold text-emerald-700 mt-1 block">
                +{currentProd.total_inward} <span className="text-xs font-medium text-emerald-600">{currentProd.unit_of_measure}</span>
              </span>
            </div>

            <div className="p-3.5 bg-red-50/60 rounded-xl border border-red-100">
              <span className="text-[11px] font-semibold text-red-800 uppercase tracking-wider block">Total Outward</span>
              <span className="text-xl font-bold text-red-700 mt-1 block">
                -{currentProd.total_outward} <span className="text-xs font-medium text-red-600">{currentProd.unit_of_measure}</span>
              </span>
            </div>
          </div>

          {/* Operational Attributes */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center space-x-2 text-slate-700">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Min Reorder Threshold</span>
                <span className="font-semibold text-slate-800">{currentProd.min_threshold} {currentProd.unit_of_measure}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-slate-700">
              <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Storage Bin / Location</span>
                <span className="font-semibold text-slate-800">{currentProd.bin_location || 'Not Specified'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-slate-700">
              <DollarSign className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Unit Cost (From Excel)</span>
                <span className="font-semibold text-slate-800">
                  {currentProd.unit_cost !== null && currentProd.unit_cost !== undefined ? formatINR(currentProd.unit_cost) : 'Price not provided'}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Movement Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Movement Timeline for this Product</span>
            </h4>

            {isLoading ? (
              <p className="text-xs text-slate-400 py-4 text-center">Loading movement log...</p>
            ) : !details?.recent_transactions || details.recent_transactions.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                No individual movement transactions recorded yet for this product. Showing summary balance.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                {details.recent_transactions.map((t: StockTransaction) => {
                  const isInward = t.transaction_type === 'INWARD';
                  return (
                    <div key={t.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition">
                      <div className="flex items-center space-x-3">
                        <div className={`p-1.5 rounded-lg ${isInward ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {isInward ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-slate-900 capitalize">{t.transaction_type.toLowerCase()}</span>
                            <span className="text-slate-400 text-[11px]">{new Date(t.transaction_date).toLocaleDateString()}</span>
                            {t.reference_no && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                {t.reference_no}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {t.supplier_or_recipient || t.remarks || 'Standard ledger movement'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold ${isInward ? 'text-emerald-700' : 'text-slate-900'}`}>
                          {isInward ? '+' : '-'}{t.quantity} {t.unit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
