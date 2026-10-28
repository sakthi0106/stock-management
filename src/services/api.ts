import {
  User,
  Product,
  StockTransaction,
  DashboardSummary,
  SyncRun,
  WorkbookInspectResult,
  AuditLogItem
} from '../types';

const BASE_URL = '/api/v1';

// Realistic Enterprise Mock Dataset
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    product_code: 'PRD-1001',
    name: 'Heavy Duty Steel Hex Bolt M12x50',
    category: 'Fasteners',
    unit_of_measure: 'PCS',
    opening_stock: 500,
    total_inward: 1200,
    total_outward: 850,
    current_balance: 850,
    min_threshold: 300,
    unit_cost: 0.45,
    bin_location: 'Aisle A-01',
    last_movement_date: '2026-10-24T10:30:00Z',
    status: 'HEALTHY',
    is_active: true,
  },
  {
    id: 2,
    product_code: 'PRD-1002',
    name: 'Stainless Steel Washer 12mm',
    category: 'Fasteners',
    unit_of_measure: 'PCS',
    opening_stock: 1200,
    total_inward: 2500,
    total_outward: 2900,
    current_balance: 800,
    min_threshold: 500,
    unit_cost: 0.12,
    bin_location: 'Aisle A-02',
    last_movement_date: '2026-10-23T14:15:00Z',
    status: 'HEALTHY',
    is_active: true,
  },
  {
    id: 3,
    product_code: 'PRD-1003',
    name: 'Grade 8 Nylon Lock Nut M12',
    category: 'Fasteners',
    unit_of_measure: 'PCS',
    opening_stock: 400,
    total_inward: 1000,
    total_outward: 1250,
    current_balance: 150,
    min_threshold: 250,
    unit_cost: 0.35,
    bin_location: 'Aisle A-03',
    last_movement_date: '2026-10-22T09:00:00Z',
    status: 'LOW_STOCK',
    is_active: true,
  },
  {
    id: 4,
    product_code: 'PRD-2001',
    name: 'Industrial Gear Oil ISO VG 220',
    category: 'Lubricants',
    unit_of_measure: 'LTR',
    opening_stock: 200,
    total_inward: 450,
    total_outward: 410,
    current_balance: 240,
    min_threshold: 100,
    unit_cost: 14.50,
    bin_location: 'Bay B-04',
    last_movement_date: '2026-10-25T11:45:00Z',
    status: 'HEALTHY',
    is_active: true,
  },
  {
    id: 5,
    product_code: 'PRD-2002',
    name: 'High-Temp Lithium Grease EP2',
    category: 'Lubricants',
    unit_of_measure: 'KG',
    opening_stock: 80,
    total_inward: 150,
    total_outward: 220,
    current_balance: 10,
    min_threshold: 25,
    unit_cost: 9.80,
    bin_location: 'Bay B-05',
    last_movement_date: '2026-10-24T16:20:00Z',
    status: 'LOW_STOCK',
    is_active: true,
  },
  {
    id: 6,
    product_code: 'PRD-2003',
    name: 'Hydraulic Fluid AW-68',
    category: 'Lubricants',
    unit_of_measure: 'LTR',
    opening_stock: 500,
    total_inward: 1000,
    total_outward: 1500,
    current_balance: 0,
    min_threshold: 150,
    unit_cost: 11.20,
    bin_location: 'Bay B-06',
    last_movement_date: '2026-10-21T08:30:00Z',
    status: 'OUT_OF_STOCK',
    is_active: true,
  },
  {
    id: 7,
    product_code: 'PRD-3001',
    name: 'Seamless Carbon Steel Pipe 2-inch',
    category: 'Raw Materials',
    unit_of_measure: 'MTR',
    opening_stock: 150,
    total_inward: 300,
    total_outward: 270,
    current_balance: 180,
    min_threshold: 50,
    unit_cost: 32.00,
    bin_location: 'Yard C-01',
    last_movement_date: '2026-10-20T13:10:00Z',
    status: 'HEALTHY',
    is_active: true,
  },
  {
    id: 8,
    product_code: 'PRD-4001',
    name: 'Nitrile Protective Gloves (Box of 100)',
    category: 'Safety Gear',
    unit_of_measure: 'BOX',
    opening_stock: 45,
    total_inward: 120,
    total_outward: 135,
    current_balance: 30,
    min_threshold: 20,
    unit_cost: 18.00,
    bin_location: 'Storage D-1',
    last_movement_date: '2026-10-25T15:00:00Z',
    status: 'HEALTHY',
    is_active: true,
  },
  {
    id: 9,
    product_code: 'PRD-4002',
    name: 'ANSI Z87.1 Safety Glasses',
    category: 'Safety Gear',
    unit_of_measure: 'PCS',
    opening_stock: 60,
    total_inward: 100,
    total_outward: 152,
    current_balance: 8,
    min_threshold: 25,
    unit_cost: 5.50,
    bin_location: 'Storage D-2',
    last_movement_date: '2026-10-24T09:40:00Z',
    status: 'LOW_STOCK',
    is_active: true,
  },
  {
    id: 10,
    product_code: 'PRD-6002',
    name: 'Heavy Duty Air Impact Wrench 1/2-inch',
    category: 'Tools & Instruments',
    unit_of_measure: 'PCS',
    opening_stock: 8,
    total_inward: 12,
    total_outward: 19,
    current_balance: 1,
    min_threshold: 5,
    unit_cost: 185.00,
    bin_location: 'Secure Cab 2',
    last_movement_date: '2026-10-22T17:00:00Z',
    status: 'LOW_STOCK',
    is_active: true,
  }
];

const MOCK_MOVEMENTS: StockTransaction[] = [
  {
    id: 101,
    product_id: 1,
    product_code: 'PRD-1001',
    product_name: 'Heavy Duty Steel Hex Bolt M12x50',
    transaction_date: '2026-10-24T10:30:00Z',
    transaction_type: 'INWARD',
    quantity: 700,
    unit: 'PCS',
    supplier_or_recipient: 'Apex Fasteners Ltd',
    reference_no: 'PO-2026-130',
    remarks: 'Supplementary lot received',
    source_sheet: 'Inward Register',
  },
  {
    id: 102,
    product_id: 4,
    product_code: 'PRD-2001',
    product_name: 'Industrial Gear Oil ISO VG 220',
    transaction_date: '2026-10-25T11:45:00Z',
    transaction_type: 'INWARD',
    quantity: 250,
    unit: 'LTR',
    supplier_or_recipient: 'PetroChem Industries',
    reference_no: 'PO-2026-104',
    remarks: 'Drum packaging inspected',
    source_sheet: 'Inward Register',
  },
  {
    id: 103,
    product_id: 1,
    product_code: 'PRD-1001',
    product_name: 'Heavy Duty Steel Hex Bolt M12x50',
    transaction_date: '2026-10-24T14:15:00Z',
    transaction_type: 'OUTWARD',
    quantity: 500,
    unit: 'PCS',
    supplier_or_recipient: 'Fabrication Line 2',
    reference_no: 'WO-4033',
    remarks: 'Conveyor structure',
    source_sheet: 'Outward Register',
  },
  {
    id: 104,
    product_id: 5,
    product_code: 'PRD-2002',
    product_name: 'High-Temp Lithium Grease EP2',
    transaction_date: '2026-10-24T16:20:00Z',
    transaction_type: 'OUTWARD',
    quantity: 25,
    unit: 'KG',
    supplier_or_recipient: 'Maintenance Team',
    reference_no: 'WO-4045',
    remarks: 'Routine preventive maintenance',
    source_sheet: 'Outward Register',
  },
  {
    id: 105,
    product_id: 6,
    product_code: 'PRD-2003',
    product_name: 'Hydraulic Fluid AW-68',
    transaction_date: '2026-10-21T08:30:00Z',
    transaction_type: 'OUTWARD',
    quantity: 300,
    unit: 'LTR',
    supplier_or_recipient: 'Hydraulics Shop',
    reference_no: 'WO-4070',
    remarks: 'Hydraulic press reservoir fill',
    source_sheet: 'Outward Register',
  }
];

export class ApiClient {
  private static token: string | null = localStorage.getItem('stock_access_token');
  private static isMockMode: boolean = localStorage.getItem('stock_mock_mode') === 'true';

  static setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('stock_access_token', token);
    } else {
      localStorage.removeItem('stock_access_token');
    }
  }

  static getToken(): string | null {
    return this.token;
  }

  static setMockMode(active: boolean) {
    this.isMockMode = active;
    localStorage.setItem('stock_mock_mode', active ? 'true' : 'false');
  }

  static getMockMode(): boolean {
    return this.isMockMode;
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      this.setToken(null);
      window.dispatchEvent(new Event('auth_unauthorized'));
      throw new Error('Authentication expired. Please log in.');
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(errorData.detail || 'Network request failed');
    }

    return res.json();
  }

  // --- Auth APIs ---
  static async login(email: string, password: string): Promise<{ access_token: string; user: User }> {
    if (this.isMockMode) {
      // Mock login based on email
      let role: any = 'PURCHASE_TEAM';
      let name = 'Marcus Sterling (Purchase)';
      if (email.includes('director')) {
        role = 'DIRECTOR';
        name = 'Eleanor Vance (Director)';
      } else if (email.includes('admin')) {
        role = 'ADMIN';
        name = 'System Administrator';
      }

      const mockUser: User = {
        id: 99,
        email,
        full_name: name,
        role,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      this.setToken('mock-jwt-token-demo');
      return { access_token: 'mock-jwt-token-demo', user: mockUser };
    }

    const data: any = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.setToken(data.access_token);
    return {
      access_token: data.access_token,
      user: {
        id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        is_active: true,
        created_at: new Date().toISOString(),
      },
    };
  }

  static async getMe(): Promise<User> {
    if (this.isMockMode) {
      return {
        id: 99,
        email: 'director@company.internal',
        full_name: 'Eleanor Vance (Director)',
        role: 'DIRECTOR',
        is_active: true,
        created_at: '2026-01-01T00:00:00Z',
      };
    }
    return this.request<User>('/auth/me');
  }

  // --- Dashboard APIs ---
  static async getDashboardSummary(): Promise<DashboardSummary> {
    if (this.isMockMode) {
      const lowAlerts = MOCK_PRODUCTS.filter(p => p.status !== 'HEALTHY');
      return {
        total_products: MOCK_PRODUCTS.length,
        total_stock_by_unit: [
          { unit: 'PCS', total_quantity: 1809, product_count: 5 },
          { unit: 'LTR', total_quantity: 240, product_count: 2 },
          { unit: 'KG', total_quantity: 10, product_count: 1 },
          { unit: 'MTR', total_quantity: 180, product_count: 1 },
          { unit: 'BOX', total_quantity: 30, product_count: 1 },
        ],
        low_stock_count: 4,
        out_of_stock_count: 1,
        healthy_stock_count: 5,
        last_sync_time: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        last_sync_status: 'SUCCESS',
        is_data_fresh: true,
        data_freshness_warning: undefined,
        recent_inward: MOCK_MOVEMENTS.filter(m => m.transaction_type === 'INWARD'),
        recent_outward: MOCK_MOVEMENTS.filter(m => m.transaction_type === 'OUTWARD'),
        low_stock_alerts: lowAlerts,
      };
    }

    return this.request<DashboardSummary>('/dashboard/summary');
  }

  // --- Product APIs ---
  static async getProducts(params: { search?: string; category?: string; status?: string } = {}): Promise<Product[]> {
    if (this.isMockMode) {
      let filtered = [...MOCK_PRODUCTS];
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(p => p.product_code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q));
      }
      if (params.category && params.category !== 'ALL') {
        filtered = filtered.filter(p => p.category === params.category);
      }
      if (params.status && params.status !== 'ALL') {
        filtered = filtered.filter(p => p.status === params.status);
      }
      return filtered;
    }

    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'ALL') query.append('category', params.category);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);

    return this.request<Product[]>(`/products?${query.toString()}`);
  }

  static async getProductDetails(id: number): Promise<any> {
    if (this.isMockMode) {
      const prod = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
      const txns = MOCK_MOVEMENTS.filter(m => m.product_code === prod.product_code);
      return {
        ...prod,
        threshold_alert_enabled: true,
        recent_transactions: txns,
      };
    }
    return this.request<any>(`/products/${id}`);
  }

  static async getCategories(): Promise<string[]> {
    if (this.isMockMode) {
      return ['Fasteners', 'Lubricants', 'Raw Materials', 'Safety Gear', 'Tools & Instruments'];
    }
    return this.request<string[]>('/products/categories');
  }

  // --- Movements APIs ---
  static async getMovements(params: { product_code?: string; transaction_type?: string } = {}): Promise<StockTransaction[]> {
    if (this.isMockMode) {
      let filtered = [...MOCK_MOVEMENTS];
      if (params.product_code) {
        filtered = filtered.filter(m => m.product_code?.toLowerCase().includes(params.product_code!.toLowerCase()));
      }
      if (params.transaction_type && params.transaction_type !== 'ALL') {
        filtered = filtered.filter(m => m.transaction_type === params.transaction_type);
      }
      return filtered;
    }

    const query = new URLSearchParams();
    if (params.product_code) query.append('product_code', params.product_code);
    if (params.transaction_type && params.transaction_type !== 'ALL') query.append('transaction_type', params.transaction_type);

    return this.request<StockTransaction[]>(`/movements?${query.toString()}`);
  }

  // --- Reports & Exports ---
  static async getStockReport(params: { category?: string; status?: string } = {}): Promise<any> {
    if (this.isMockMode) {
      const prods = await this.getProducts(params);
      let valuation = 0;
      let count = 0;
      const items = prods.map(p => {
        const hasUnitCost = p.unit_cost !== null && p.unit_cost !== undefined;
        const val = hasUnitCost ? p.current_balance * p.unit_cost : null;
        if (val !== null) {
          valuation += val;
          count++;
        }
        return {
          ...p,
          unit: p.unit_of_measure,
          stock_value: val !== null ? Math.round(val * 100) / 100 : null,
        };
      });
      return {
        items,
        total_items: items.length,
        total_valuation: Math.round(valuation * 100) / 100,
        valuation_tracked_count: count,
      };
    }

    const query = new URLSearchParams();
    if (params.category && params.category !== 'ALL') query.append('category', params.category);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);

    return this.request<any>(`/reports/stock-summary?${query.toString()}`);
  }

  static getExportUrl(format: 'csv' | 'xlsx', params: { category?: string; status?: string } = {}): string {
    const query = new URLSearchParams({ format });
    if (params.category && params.category !== 'ALL') query.append('category', params.category);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    return `${BASE_URL}/reports/export?${query.toString()}`;
  }

  // --- Sync APIs ---
  static async getSyncStatus(): Promise<{ latest_run: SyncRun | null; history: SyncRun[] }> {
    if (this.isMockMode) {
      const mockLatest: SyncRun = {
        id: 1,
        source_type: 'AGENT',
        status: 'SUCCESS',
        file_name: 'company_inventory_master.xlsx',
        file_hash: 'e5f568a60962c51d16f1e7227e06d8343b90099d8605606d7773ecf5eff2862a',
        rows_read: 35,
        rows_inserted: 25,
        rows_updated: 10,
        rows_skipped: 0,
        started_at: '2026-10-26T10:00:00Z',
        completed_at: '2026-10-26T10:00:03Z',
      };
      return {
        latest_run: mockLatest,
        history: [mockLatest],
      };
    }

    return this.request<{ latest_run: SyncRun | null; history: SyncRun[] }>('/sync/status');
  }

  static async inspectWorkbook(file: File): Promise<WorkbookInspectResult> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<WorkbookInspectResult>('/sync/inspect', {
      method: 'POST',
      body: formData,
    });
  }

  static async manualSyncUpload(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<any>('/sync/manual', {
      method: 'POST',
      body: formData,
    });
  }

  // --- Admin APIs ---
  static async getUsers(): Promise<User[]> {
    if (this.isMockMode) {
      return [
        { id: 1, email: 'director@company.internal', full_name: 'Eleanor Vance', role: 'DIRECTOR', is_active: true, created_at: '2026-01-01T00:00:00Z' },
        { id: 2, email: 'purchase@company.internal', full_name: 'Marcus Sterling', role: 'PURCHASE_TEAM', is_active: true, created_at: '2026-01-01T00:00:00Z' },
        { id: 3, email: 'admin@company.internal', full_name: 'System Administrator', role: 'ADMIN', is_active: true, created_at: '2026-01-01T00:00:00Z' },
      ];
    }
    return this.request<User[]>('/admin/users');
  }

  static async createUser(payload: { email: string; password: string; full_name: string; role: string }): Promise<User> {
    return this.request<User>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  static async toggleUserStatus(userId: number, isActive: boolean): Promise<User> {
    return this.request<User>(`/admin/users/${userId}/status?is_active=${isActive}`, {
      method: 'PUT',
    });
  }

  static async getAuditLogs(): Promise<AuditLogItem[]> {
    if (this.isMockMode) {
      return [
        { id: 1, user_email: 'admin@company.internal', action: 'EXCEL_SYNC', resource_type: 'WORKBOOK', resource_id: 'company_inventory_master.xlsx', details: 'Read 35 rows: 25 inserted, 10 updated, 0 skipped', created_at: '2026-10-26T10:00:03Z' },
        { id: 2, user_email: 'director@company.internal', action: 'USER_LOGIN', resource_type: 'AUTH', resource_id: '1', details: 'User logged in successfully', created_at: '2026-10-26T10:15:00Z' },
      ];
    }
    return this.request<AuditLogItem[]>('/admin/audit-logs');
  }
}
