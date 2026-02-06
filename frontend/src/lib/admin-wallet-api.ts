import { API_BASE_URL, authFetch } from './api';

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
    config?: any;
}

export async function fetchPendingTopUps(): Promise<AdminTopUpRequest[]> {
    const response = await authFetch(`${API_BASE_URL}/admin/topups/pending`);
    if (!response.ok) throw new Error('Failed to fetch pending requests');
    const json = await response.json();
    return json.data;
}

export async function fetchAllTopUps(params?: any): Promise<AdminTopUpRequest[]> {
    const query = new URLSearchParams(params).toString();
    const response = await authFetch(`${API_BASE_URL}/admin/topups?${query}`);
    if (!response.ok) throw new Error('Failed to fetch requests');
    const json = await response.json();
    return json.data;
}

export async function approveTopUp(id: number, notes?: string): Promise<any> {
    const response = await authFetch(`${API_BASE_URL}/admin/topups/${id}/approve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes })
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.message || 'Failed to approve request');
    return json;
}

export async function rejectTopUp(id: number, reason: string): Promise<any> {
    const response = await authFetch(`${API_BASE_URL}/admin/topups/${id}/reject`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.message || 'Failed to reject request');
    return json;
}

export async function fetchWalletStats(): Promise<WalletStats> {
    const response = await authFetch(`${API_BASE_URL}/admin/topups/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    const json = await response.json();
    return json.data;
}

export async function fetchAdminPaymentMethods(): Promise<AdminPaymentMethod[]> {
    const response = await authFetch(`${API_BASE_URL}/admin/payment-methods`);
    if (!response.ok) throw new Error('Failed to fetch methods');
    const json = await response.json();
    return json.data;
}

export async function updatePaymentMethod(id: number, data: Partial<AdminPaymentMethod>): Promise<AdminPaymentMethod> {
    const response = await authFetch(`${API_BASE_URL}/admin/payment-methods/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.message || 'Update failed');
    return json.data;
}

export async function togglePaymentMethod(id: number): Promise<boolean> {
    const response = await authFetch(`${API_BASE_URL}/admin/payment-methods/${id}/toggle`, { method: 'POST' });
    return response.ok;
}
