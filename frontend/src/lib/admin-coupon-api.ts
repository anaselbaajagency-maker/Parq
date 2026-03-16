import { API_BASE_URL, authFetch } from './api';

export interface Coupon {
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
    used_by?: {
        id: number;
        full_name: string;
        email: string;
        used_at: string;
    }[];
}

export async function fetchAllCoupons(): Promise<Coupon[]> {
    const response = await authFetch(`${API_BASE_URL}/admin/coupons`);
    const result = await response.json();
    return result.data;
}

export async function fetchCouponDetails(id: number): Promise<Coupon> {
    const response = await authFetch(`${API_BASE_URL}/admin/coupons/${id}`);
    const result = await response.json();
    return result.data;
}

export async function createCoupon(data: Partial<Coupon>): Promise<Coupon> {
    const response = await authFetch(`${API_BASE_URL}/admin/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to create coupon');
    return result.data;
}

export async function updateCoupon(id: number, data: Partial<Coupon>): Promise<Coupon> {
    const response = await authFetch(`${API_BASE_URL}/admin/coupons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update coupon');
    return result.data;
}

export async function toggleCoupon(id: number): Promise<{ is_active: boolean }> {
    const response = await authFetch(`${API_BASE_URL}/admin/coupons/${id}/toggle`, {
        method: 'POST',
    });
    const result = await response.json();
    return result.data;
}

export async function deleteCoupon(id: number): Promise<void> {
    const response = await authFetch(`${API_BASE_URL}/admin/coupons/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to delete coupon');
    }
}
