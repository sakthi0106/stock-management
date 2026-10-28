export type UserRole = 'DIRECTOR' | 'PURCHASE_TEAM' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isMockMode: boolean;
}

export interface Product {
  id: number;
  product_code: string;
  name: string;
  category: string;
  unit_of_measure: string;
  opening_stock: number;
  total_inward: number;
  total_outward: number;
  current_balance: number;
  min_threshold: number;
  unit_cost?: number;
  bin_location?: string;
  last_movement_date?: string;
  status: 'HEALTHY' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  is_active: boolean;
}

export interface StockTransaction {
  id: number;
  product_id: number;
  product_code?: string;
  product_name?: string;
  transaction_date: string;
  transaction_id_source?: string;
  transaction_type: 'INWARD' | 'OUTWARD';
  quantity: number;
  unit: string;
  balance_after?: number;
  supplier_or_recipient?: string;
  reference_no?: string;
  challan_no?: string;
  handled_by?: string;
  remarks?: string;
  source_sheet: string;
  sync_run_id?: number;
}

export interface UnitStockSummary {
  unit: string;
  total_quantity: number;
  product_count: number;
}

export interface DashboardSummary {
  total_products: number;
  total_stock_by_unit: UnitStockSummary[];
  low_stock_count: number;
  out_of_stock_count: number;
  healthy_stock_count: number;
  last_sync_time?: string;
  last_sync_status?: string;
  is_data_fresh: boolean;
  data_freshness_warning?: string;
  recent_inward: StockTransaction[];
  recent_outward: StockTransaction[];
  low_stock_alerts: Product[];
}

export interface SyncRun {
  id: number;
  source_type: string;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED' | 'RUNNING';
  file_name: string;
  file_hash: string;
  rows_read: number;
  rows_inserted: number;
  rows_updated: number;
  rows_skipped: number;
  error_log?: string;
  started_at: string;
  completed_at?: string;
}

export interface SheetInspection {
  sheet_name: string;
  total_rows: number;
  total_cols: number;
  sample_headers: string[];
  sample_rows: string[][];
}

export interface WorkbookInspectResult {
  file_name: string;
  file_hash: string;
  sheets: SheetInspection[];
  detected_recommendations: Record<string, {
    likely_sheet_type: string;
    mappings: Record<string, string>;
  }>;
}

export interface AuditLogItem {
  id: number;
  user_email?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: string;
  ip_address?: string;
  created_at: string;
}
