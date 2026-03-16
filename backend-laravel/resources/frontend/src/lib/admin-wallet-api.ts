import { API_BASE_URL, authFetch } from './api';

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
    if (!response.ok) throw new Error('Failed to fetch stats');
    const json = await response.json() as ApiEnvelope<WalletStats>;
    return json.data;
}

export async function fetchAdminPaymentMethods(): Promise<AdminPaymentMethod[]> {
    const response = await authFetch(`${API_BASE_URL}/admin/payment-methods`);
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
