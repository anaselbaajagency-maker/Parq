import { API_BASE_URL, authFetch as defaultAuthFetch } from './api';

// Helper to get token from localStorage directly (same as api.ts)
const getToken = () => {
    if (typeof window === 'undefined') return null;
    const storage = localStorage.getItem('parq-auth');
    if (!storage) return null;
    try {
        const { state } = JSON.parse(storage);
        return state?.token || null;
    } catch {
        return null;
    }
};

export interface WalletBalance {
    balance: number;
    currency_label: string;
    formatted_balance: string;
    balance_in_mad: number;
}

export interface WalletTransaction {
    id: number;
    amount: number;
    formatted_amount: string;
    type: string;
    type_label: string;
    source: string;
    source_label: string;
    description: string;
    created_at: string;
    receipt_url?: string | null;
}

export interface PaymentMethod {
    code: string;
    name: string;
    name_ar?: string;
    description: string;
    description_ar?: string;
    icon: string;
    is_active: boolean;
    sort_order: number;
    config?: any;
    instructions?: string; // Derived from description
}

export interface TopUpRequest {
    id: number;
    amount: number;
    method: string;
    method_label: string;
    status: string; // 'pending', 'approved', 'rejected', 'cancelled'
    status_label: string;
    status_color: string;
    reference: string;
    proof_image: string | null;
    admin_notes: string | null;
    created_at: string;
    approved_at: string | null;
}

export async function fetchWalletBalance(): Promise<WalletBalance | null> {
    try {
        const response = await defaultAuthFetch(`${API_BASE_URL}/wallet/balance`);
        if (!response.ok) {
            if (response.status === 401) throw new Error('Unauthorized');
            console.error('Fetch Balance Error:', response.status, response.statusText, await response.text());
            throw new Error(`Failed to fetch balance: ${response.status}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

export async function fetchWalletTransactions(limit = 20, offset = 0, type?: string): Promise<WalletTransaction[]> {
    try {
        let url = `${API_BASE_URL}/wallet/transactions?limit=${limit}&offset=${offset}`;
        if (type) url += `&type=${type}`;

        const response = await defaultAuthFetch(url);
        if (!response.ok) {
            if (response.status === 401) throw new Error('Unauthorized');
            console.error('Fetch Transactions Error:', response.status, await response.text());
            throw new Error(`Failed to fetch transactions: ${response.status}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}

export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
    try {
        const response = await defaultAuthFetch(`${API_BASE_URL}/wallet/payment-methods`);
        if (!response.ok) {
            if (response.status === 401) throw new Error('Unauthorized');
            console.error('Fetch Methods Error:', response.status, await response.text());
            throw new Error(`Failed to fetch payment methods: ${response.status}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}

// Custom fetch for FormData to avoid Content-Type header issue
async function formDataFetch(url: string, method: string, body: FormData) {
    const token = getToken();
    const headers: Record<string, string> = {
        'Accept': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Do NOT set Content-Type manually, let browser set it with boundary for FormData

    const response = await fetch(url, {
        method,
        headers,
        body
    });

    return response;
}

export async function initiateTopUp(amount: number, method: string, proofImage?: File): Promise<any> {
    try {
        if (method === 'bank_transfer' && proofImage) {
            // Use FormData for file upload
            const formData = new FormData();
            formData.append('amount', amount.toString());
            formData.append('method', method);
            formData.append('proof_image', proofImage);

            const response = await formDataFetch(`${API_BASE_URL}/wallet/topup`, 'POST', formData);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Top-up failed');
            }
            return await response.json();
        } else {
            // Use JSON for online payments
            const response = await defaultAuthFetch(`${API_BASE_URL}/wallet/topup`, {
                method: 'POST',
                body: JSON.stringify({ amount, method }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Top-up failed');
            }
            return await response.json();
        }
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

export async function fetchTopUpRequests(): Promise<TopUpRequest[]> {
    try {
        const response = await defaultAuthFetch(`${API_BASE_URL}/wallet/topup-requests`);
        if (!response.ok) {
            if (response.status === 401) throw new Error('Unauthorized');
            console.error('Fetch Requests Error:', response.status, await response.text());
            throw new Error(`Failed to fetch requests: ${response.status}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}

export async function cancelTopUpRequest(id: number): Promise<boolean> {
    try {
        const response = await defaultAuthFetch(`${API_BASE_URL}/wallet/topup-requests/${id}`, {
            method: 'DELETE'
        });
        return response.ok;
    } catch (error) {
        console.error('API Error:', error);
        return false;
    }
}

export async function redeemCoupon(code: string): Promise<any> {
    try {
        const response = await defaultAuthFetch(`${API_BASE_URL}/wallet/redeem-coupon`, {
            method: 'POST',
            body: JSON.stringify({ code })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to redeem coupon');
        }

        return result;
    } catch (error) {
        throw error;
    }
}
