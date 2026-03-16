import { API_BASE_URL, authFetch } from './api';
// HMR evaluation trigger: 2026-03-09T17:28:00
type QueryParamValue = string | number | boolean;

interface ApiEnvelope<TData> {
    success?: boolean;
    message?: string;
    data: TData;
}

export interface AdminTopUpActionResponse {
    success?: boolean;
    message?: string;
    data?: AdminTopUpRequest;
}

export type AdminTopUpFilters = {
    status?: 'pending' | 'approved' | 'rejected';
    search?: string;
    page?: number;
    limit?: number;
} & Record<string, QueryParamValue | undefined>;

export interface AdminTopUpRequest {
    id: number;
    user: {
        id: number;
        full_name: string;
        email: string;
        avatar?: string;
    };
    amount: number;
    method: string;
    method_label: string;
    status: 'pending' | 'approved' | 'rejected';
    status_label: string;
    status_color: string;
    reference: string;
    proof_image?: string;
    created_at: string;
    admin_notes?: string;
    approver?: {
        full_name: string;
    };
    approved_at?: string;
}

export interface WalletStats {
    pending_count: number;
    pending_amount: number;
    approved_today: number;
    approved_today_amount: number;
    approved_this_month: number;
    approved_this_month_amount: number;
    coupons_total_credit: number;
    free_credits_total: number;
}

export interface AdminCoupon {
    id: number;
    code: string;
    credit_amount: number;
    max_uses: number;
    used_count: number;
    remaining_uses: number;
    expires_at: string | null;
    is_active: boolean;
    is_valid: boolean;
    is_expired: boolean;
    description: string | null;
    created_at: string;
}

export interface AdminPaymentMethod {
    id: number;
    code: string;
    name: string;
    name_ar?: string;
    description: string;
    description_ar?: string;
    is_active: boolean;
    sort_order: number;
    icon: string;
    config?: Record<string, unknown>;
}

export async function fetchPendingTopUps(): Promise<AdminTopUpRequest[]> {
    const response = await authFetch(`${API_BASE_URL}/admin/topups/pending`);
    if (response.status === 401 || response.status === 403) throw new Error('ACCESS_DENIED');
    if (!response.ok) throw new Error('Failed to fetch pending requests');
    const json = await response.json() as ApiEnvelope<AdminTopUpRequest[]>;
    return json.data;
}

export async function fetchAllTopUps(params: AdminTopUpFilters = {}): Promise<AdminTopUpRequest[]> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined) {
            return;
        }
        queryParams.set(key, String(value));
    });

    const query = queryParams.toString();
    const url = query ? `${API_BASE_URL}/admin/topups?${query}` : `${API_BASE_URL}/admin/topups`;
    const response = await authFetch(url);
    if (response.status === 401 || response.status === 403) throw new Error('ACCESS_DENIED');
    if (!response.ok) throw new Error('Failed to fetch requests');
    const json = await response.json() as ApiEnvelope<AdminTopUpRequest[]>;
    return json.data;
}

export async function approveTopUp(id: number, notes?: string): Promise<AdminTopUpActionResponse> {
    const response = await authFetch(`${API_BASE_URL}/admin/topups/${id}/approve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes })
    });
    const json = await response.json() as AdminTopUpActionResponse;
    if (!response.ok) throw new Error(json.message || 'Failed to approve request');
    return json;
}

export async function rejectTopUp(id: number, reason: string): Promise<AdminTopUpActionResponse> {
    const response = await authFetch(`${API_BASE_URL}/admin/topups/${id}/reject`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
    });
    const json = await response.json() as AdminTopUpActionResponse;
    if (!response.ok) throw new Error(json.message || 'Failed to reject request');
    return json;
}

export async function fetchWalletStats(): Promise<WalletStats> {
    const response = await authFetch(`${API_BASE_URL}/admin/topups/stats`);
    if (response.status === 401 || response.status === 403) throw new Error('ACCESS_DENIED');
    if (!response.ok) throw new Error('Failed to fetch stats');
    const json = await response.json() as ApiEnvelope<WalletStats>;
    return json.data;
}

export async function fetchAdminPaymentMethods(): Promise<AdminPaymentMethod[]> {
    const response = await authFetch(`${API_BASE_URL}/admin/payment-methods`);

    if (response.status === 401 || response.status === 403) {
        throw new Error('ACCESS_DENIED');
    }

    if (!response.ok) throw new Error('Failed to fetch methods');
    const json = await response.json() as ApiEnvelope<AdminPaymentMethod[]>;
    return json.data;
}

export async function updatePaymentMethod(id: number, data: Partial<AdminPaymentMethod>): Promise<AdminPaymentMethod> {
    const response = await authFetch(`${API_BASE_URL}/admin/payment-methods/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const json = await response.json() as ApiEnvelope<AdminPaymentMethod>;
    if (!response.ok) throw new Error(json.message || 'Update failed');
    return json.data;
}

export async function togglePaymentMethod(id: number): Promise<boolean> {
    const response = await authFetch(`${API_BASE_URL}/admin/payment-methods/${id}/toggle`, { method: 'POST' });
    return response.ok;
}

export async function createPaymentMethod(data: Partial<AdminPaymentMethod>): Promise<AdminPaymentMethod> {
    const response = await authFetch(`${API_BASE_URL}/admin/payment-methods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const json = await response.json() as ApiEnvelope<AdminPaymentMethod>;
    if (!response.ok) throw new Error(json.message || 'Creation failed');
    return json.data;
}

export async function deletePaymentMethod(id: number): Promise<boolean> {
    const response = await authFetch(`${API_BASE_URL}/admin/payment-methods/${id}`, { method: 'DELETE' });
    if (!response.ok) {
        const json = await response.json();
        throw new Error(json?.message || 'Delete failed');
    }
    return response.ok;
}

export async function bulkDeletePaymentMethods(ids: number[]): Promise<boolean> {
    const response = await authFetch(`${API_BASE_URL}/admin/payment-methods/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
    });
    return response.ok;
}

// Coupon Management
export async function fetchCoupons(): Promise<AdminCoupon[]> {
    const response = await authFetch(`${API_BASE_URL}/admin/coupons`);
    if (!response.ok) throw new Error('Failed to fetch coupons');
    const json = await response.json() as ApiEnvelope<AdminCoupon[]>;
    return json.data;
}

export async function createCoupon(data: Partial<AdminCoupon>): Promise<AdminCoupon> {
    const response = await authFetch(`${API_BASE_URL}/admin/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const json = await response.json() as ApiEnvelope<AdminCoupon>;
    if (!response.ok) throw new Error(json.message || 'Creation failed');
    return json.data;
}

export async function toggleCoupon(id: number): Promise<boolean> {
    const response = await authFetch(`${API_BASE_URL}/admin/coupons/${id}/toggle`, { method: 'POST' });
    return response.ok;
}

export async function deleteCoupon(id: number): Promise<boolean> {
    const response = await authFetch(`${API_BASE_URL}/admin/coupons/${id}`, { method: 'DELETE' });
    return response.ok;
}

export async function bulkDeleteCoupons(ids: number[]): Promise<boolean> {
    const response = await authFetch(`${API_BASE_URL}/admin/coupons/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
    });
    return response.ok;
}
