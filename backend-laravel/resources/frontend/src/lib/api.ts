import { Listing, PaginatedResponse, Category, City, Settings, DashboardStats, DashboardActivity, PerformanceData } from '@/types/listing';
import { WalletBalance, Transaction, TopUpRequest } from '@/types/wallet';
import { getAuthToken } from './auth-token';
import { captureClientError, createRequestId } from './monitoring';
import type { User as AuthStoreUser } from './auth-store';

type QueryPrimitive = string | number | boolean;
type QueryParams = Record<string, QueryPrimitive | null | undefined>;

export interface ApiUser {
    id: number | string;
    full_name: string;
    email?: string;
    role?: string;
    name?: string | null;
    avatar?: string;
    phone?: string;
    created_at?: string;
}

export interface AuthPayload {
    email: string;
    password: string;
    client_type?: 'web' | 'mobile';
    device_name?: string;
}

interface RegisterPayloadBase {
    full_name: string;
    email: string;
    role: string;
    avatar?: string;
    phone?: string;
    client_type?: 'web' | 'mobile';
    device_name?: string;
}

type EmailRegisterPayload = RegisterPayloadBase & {
    password: string;
    google_id?: never;
};

type GoogleRegisterPayload = RegisterPayloadBase & {
    google_id: string;
    password?: null;
};

export type RegisterPayload = EmailRegisterPayload | GoogleRegisterPayload;

export interface AuthResponse {
    user: AuthStoreUser;
    token: string;
}

export interface AdminStatsResponse {
    total_users: number;
    total_listings: number;
    pending_approvals: number;
    total_revenue: number;
}

export interface GenericApiResponse {
    success?: boolean;
    message?: string;
    [key: string]: unknown;
}

export interface UserProfileResponse {
    user: ApiUser;
    listings: Listing[];
}

export interface AdminUsersQuery {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    [key: string]: QueryPrimitive | null | undefined;
}

export interface AdminUserRecord {
    id: string | number;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
    listings_count?: number;
}

export interface AdminUserUpdatePayload {
    role?: string;
    full_name?: string;
    email?: string;
}

// Defining basic Message types here for API use
export interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    listing_id?: number;
    content: string;
    read_at?: string;
    created_at: string;
    sender?: ApiUser;
    receiver?: ApiUser;
}

export interface Conversation {
    user: ApiUser; // The other user
    last_message: Message;
    unread_count: number;
}

// Re-export types for backward compatibility and ease of use
export type { Listing, Category, City, Settings, DashboardStats, DashboardActivity, PerformanceData };
export type { Listing as ApiListing }; // Alias used in some components

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
export const API_BASE_URL = API_URL;

export async function fetchAdminStats() {
    const token = getAuthToken();
    return fetchAPI<AdminStatsResponse>('admin/stats', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
}

function normalizeHeaders(headers?: HeadersInit): Record<string, string> {
    if (!headers) {
        return {};
    }

    if (headers instanceof Headers) {
        const normalized: Record<string, string> = {};
        headers.forEach((value, key) => {
            normalized[key] = value;
        });

        return normalized;
    }

    if (Array.isArray(headers)) {
        return Object.fromEntries(headers);
    }

    return { ...headers };
}

function toQueryString(params?: QueryParams): string {
    if (!params) {
        return '';
    }

    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) {
            return;
        }

        query.set(key, String(value));
    });

    return query.toString();
}

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const requestId = createRequestId();
    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'X-Request-ID': requestId,
        ...normalizeHeaders(options.headers),
    };

    // Attach bearer token automatically if available and not already set.
    if (!headers['Authorization']) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    // Automatically add Content-Type if body is not FormData
    if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    let res: Response;
    try {
        res = await fetch(`${API_URL}/${endpoint}`, { ...options, headers });
    } catch (error) {
        void captureClientError(error, {
            scope: 'api.network',
            endpoint,
            request_id: requestId,
        });
        throw error;
    }

    const responseRequestId = res.headers.get('X-Request-ID') || requestId;

    if (!res.ok) {
        const errorBody = await res.text();
        let errorMessage = `API Error: ${res.status} - ${errorBody}`;
        try {
            const errorJson = JSON.parse(errorBody) as { message?: string };
            if (errorJson.message) {
                errorMessage = `API Error ${res.status}: ${errorJson.message}`;
            }
        } catch {
            // Keep original parsing if not valid JSON
        }

        void captureClientError(new Error(errorMessage), {
            scope: 'api.response',
            endpoint,
            status: res.status,
            request_id: responseRequestId,
        });
        throw new Error(errorMessage);
    }

    return res.json();
}

/**
 * Authenticated fetch wrapper
 */
export async function authFetch(url: string, options: RequestInit = {}) {
    const token = getAuthToken();
    const requestId = createRequestId();
    const headers = {
        ...(options.headers || {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'X-Request-ID': requestId,
    };
    return fetch(url, { ...options, headers });
}

export const apiLogin = async (data: AuthPayload) => {
    return fetchAPI<AuthResponse>('login', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const apiRegister = async (data: RegisterPayload) => {
    return fetchAPI<AuthResponse>('register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const api = {
    listings: {
        getAll: async (params?: QueryParams) => {
            const token = getAuthToken();
            const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
            const queryString = toQueryString(params);
            return fetchAPI<PaginatedResponse<Listing>>(`listings?${queryString}`, {
                cache: 'no-store',
                headers
            });
        },

        getFeatured: async () => {
            return fetchAPI<PaginatedResponse<Listing>>('listings?sort=featured&limit=4', { next: { revalidate: 3600 } });
        },

        getOne: async (slugOrId: string | number) => {
            const token = getAuthToken();
            const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
            return fetchAPI<Listing>(`listings/${slugOrId}`, {
                cache: 'no-store',
                headers
            });
        },

        create: async (data: Partial<Listing> | FormData, token?: string) => {
            const effectiveToken = token || getAuthToken();
            return fetchAPI<Listing>('listings', {
                method: 'POST',
                headers: effectiveToken ? { 'Authorization': `Bearer ${effectiveToken}` } : {},
                body: data instanceof FormData ? data : JSON.stringify(data),
            });
        },

        update: async (id: number | string, data: Partial<Listing> | FormData, token?: string) => {
            const effectiveToken = token || getAuthToken();
            const isFormData = data instanceof FormData;
            return fetchAPI<Listing>(`listings/${id}`, {
                method: isFormData ? 'POST' : 'PUT',
                headers: effectiveToken ? { 'Authorization': `Bearer ${effectiveToken}` } : {},
                body: isFormData ? data : JSON.stringify(data),
            });
        },

        pause: async (id: number | string, token?: string) => {
            const effectiveToken = token || getAuthToken();
            return fetchAPI<{ status: string }>(`listings/${id}/pause`, {
                method: 'POST',
                headers: effectiveToken ? { 'Authorization': `Bearer ${effectiveToken}` } : {},
            });
        },

        delete: async (id: number | string, token?: string) => {
            const effectiveToken = token || getAuthToken();
            return fetchAPI<void>(`listings/${id}`, {
                method: 'DELETE',
                headers: effectiveToken ? { 'Authorization': `Bearer ${effectiveToken}` } : {},
            });
        },

        getByCategory: async (categorySlug: string, limit?: number, citySlug?: string, page: number = 1) => {
            const token = getAuthToken();
            const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
            let url = `listings/category/${categorySlug}?page=${page}&`;
            if (limit) url += `limit=${limit}&`;
            if (citySlug) url += `city=${citySlug}&`;
            const response = await fetchAPI<PaginatedResponse<Listing> | Listing[]>(url, {
                cache: 'no-store',
                headers
            });
            // Handle paginated response from backend
            return Array.isArray(response) ? response : (response.data || []);
        },

        toggleFavorite: async (id: number | string) => {
            const token = getAuthToken();
            return fetchAPI<{ is_favorited: boolean, message: string }>(`listings/${id}/favorite`, {
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            });
        }
    },
    wallet: {
        getBalance: async () => {
            const token = getAuthToken();
            return fetchAPI<WalletBalance>('wallet/balance', {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                cache: 'no-store'
            });
        },
        getTransactions: async (limit: number = 20, offset: number = 0, type?: string) => {
            const token = getAuthToken();
            let url = `wallet/transactions?limit=${limit}&offset=${offset}`;
            if (type) url += `&type=${type}`;

            return fetchAPI<Transaction[]>(url, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                cache: 'no-store'
            });
        },
        createTopUp: async (data: { method: string, amount: number }) => {
            const token = getAuthToken();
            return fetchAPI<TopUpRequest>('wallet/topup', {
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                body: JSON.stringify(data),
            });
        },
        uploadProof: async (requestId: number, file: File) => {
            const token = getAuthToken();
            const formData = new FormData();
            formData.append('proof', file);
            return fetchAPI<GenericApiResponse>(`wallet/topup/${requestId}/proof`, {
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                body: formData,
            });
        },
        redeemCoupon: async (code: string) => {
            const token = getAuthToken();
            return fetchAPI<{ message: string, amount: number }>('wallet/redeem-coupon', {
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                body: JSON.stringify({ code }),
            });
        }
    }
};

export const apiGoogleLogin = async (data: { email: string; google_id: string; full_name: string; avatar: string }) => {
    return fetchAPI<AuthResponse>('auth/google-login', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

// ==========================================================
// Compatibility Layer / Top-level functions
// ==========================================================

export async function fetchCategories(typeOrParams?: string, activeOnly?: boolean) {
    // Build query parameters
    const params = new URLSearchParams();

    // If first param is a string (type), filter by it
    if (typeof typeOrParams === 'string' && typeOrParams !== 'all') {
        params.set('type', typeOrParams);
    }

    // If activeOnly is true, add active filter
    if (activeOnly) {
        params.set('active', '1');
    }

    const queryString = params.toString();
    const endpoint = queryString ? `categories?${queryString}` : 'categories';
    return fetchAPI<Category[]>(endpoint);
}

export async function fetchHomepageCategories() {
    return fetchAPI<Category[]>('categories/homepage');
}

export async function fetchSettings() {
    return fetchAPI<Settings>('settings');
}

export async function updateSettings(data: Settings) {
    const token = getAuthToken();
    return fetchAPI<Settings>('admin/settings/bulk', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: JSON.stringify(data),
    });
}

export async function fetchDashboardStats(userId?: number | string) {
    void userId;
    // userId param is legacy/optional now as backend uses auth token
    const token = getAuthToken();
    return fetchAPI<DashboardStats>('dashboard/stats', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
}

export async function fetchDashboardActivity(userId?: number | string) {
    void userId;
    const token = getAuthToken();
    return fetchAPI<DashboardActivity[]>('dashboard/activity', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
}

export async function fetchDashboardPerformance(userId?: number | string) {
    void userId;
    const token = getAuthToken();
    return fetchAPI<PerformanceData>('dashboard/performance', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
}

export async function fetchUserListings(userId?: number | string) {
    const response = await api.listings.getAll(userId ? { user_id: userId } : {});
    return response.data;
}

export async function fetchUserProfile(userId: number | string) {
    const token = getAuthToken();
    return fetchAPI<UserProfileResponse>(`users/${userId}/profile`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        cache: 'no-store'
    });
}

export async function fetchCities(activeOnly?: boolean) {
    const endpoint = activeOnly ? 'cities?active=1' : 'cities';
    const res = await fetchAPI<PaginatedResponse<City> | City[]>(endpoint);
    return Array.isArray(res) ? res : (res.data || []);
}

export async function recordListingView(idOrSlug: string | number) {
    try {
        return fetchAPI(`listings/${idOrSlug}/view`, { method: 'POST' });
    } catch {
        return null;
    }
}

export async function fetchListings(params?: QueryParams) {
    const response = await api.listings.getAll(params);
    return response.data;
}

export async function fetchListing(idOrSlug: string | number) {
    return api.listings.getOne(idOrSlug);
}

export async function fetchListingBySlug(slug: string) {
    return api.listings.getOne(slug);
}

export async function fetchListingsByCategory(categoryId: string | number, limit?: number, citySlug?: string, page: number = 1) {
    return api.listings.getByCategory(String(categoryId), limit, citySlug, page);
}

export async function createListing(data: FormData | Partial<Listing>, token?: string) {
    return api.listings.create(data, token);
}

export async function updateListing(id: string | number, data: FormData | Partial<Listing>, token?: string) {
    return api.listings.update(id, data, token);
}

export async function deleteListing(id: string | number, token?: string) {
    return api.listings.delete(id, token);
}

export async function pauseListing(id: string | number, token?: string) {
    return api.listings.pause(id, token);
}

export async function fetchAdminListings(params?: { search?: string; status?: string }) {
    const token = getAuthToken();
    let url = 'admin/listings';
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.set('search', params.search);
    if (params?.status) queryParams.set('status', params.status);
    const queryString = queryParams.toString();
    if (queryString) url += `?${queryString}`;

    const response = await fetchAPI<PaginatedResponse<Listing> | Listing[]>(url, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    return Array.isArray(response) ? response : (response.data || []);
}

export async function approveListing(id: string | number) {
    const token = getAuthToken();
    return fetchAPI<GenericApiResponse>(`admin/listings/${id}/approve`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
}

export async function rejectListing(id: string | number, reason: string) {
    const token = getAuthToken();
    return fetchAPI<GenericApiResponse>(`admin/listings/${id}/reject`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: JSON.stringify({ reason }),
    });
}


export async function hideListing(id: string | number) {
    const token = getAuthToken();
    return fetchAPI<GenericApiResponse>(`listings/${id}/pause`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
}

export async function apiForgotPassword(email: string) {
    return fetchAPI('forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
}

// City Management
export async function createCity(data: Partial<City>) {
    return fetchAPI<City>('cities', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        body: JSON.stringify(data),
    });
}

export async function updateCity(id: string | number, data: Partial<City>) {
    return fetchAPI<City>(`cities/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        body: JSON.stringify(data),
    });
}

export async function deleteCity(id: string | number) {
    return fetchAPI<void>(`cities/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
    });
}

// Category Management
export async function createCategory(data: Partial<Category>) {
    return fetchAPI<Category>('categories', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        body: JSON.stringify(data),
    });
}

export async function updateCategory(id: string | number, data: Partial<Category>) {
    return fetchAPI<Category>(`categories/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        body: JSON.stringify(data),
    });
}

export async function deleteCategory(id: string | number) {
    return fetchAPI<void>(`categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
    });
}

export async function updateHomepageCategories(categoryIds: string[]) {
    return fetchAPI<GenericApiResponse>('admin/categories/bulk-homepage', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        body: JSON.stringify({ ids: categoryIds }),
    });
}


// User Management
// User Management
export async function fetchAdminUsers(params?: AdminUsersQuery) {
    const token = getAuthToken();
    const query = toQueryString(params);
    return fetchAPI<PaginatedResponse<AdminUserRecord>>(`admin/users?${query}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
}

export async function updateAdminUser(id: number | string, data: AdminUserUpdatePayload) {
    const token = getAuthToken();
    return fetchAPI<GenericApiResponse>(`admin/users/${id}`, {
        method: 'PUT',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: JSON.stringify(data),
    });
}

export async function deleteAdminUser(id: number | string) {
    const token = getAuthToken();
    return fetchAPI<void>(`admin/users/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
}

// =============================================
// MESSAGING API
// =============================================
export const apiMessages = {
    getUnreadCount: async () => {
        const token = getAuthToken();
        if (!token) return { count: 0 };
        return fetchAPI<{ count: number }>('messages/unread-count', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },

    getConversations: async () => {
        const token = getAuthToken();
        if (!token) return [];
        return fetchAPI<Conversation[]>('messages', {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store'
        });
    },

    getMessages: async (userId: number | string) => {
        const token = getAuthToken();
        if (!token) return [];
        return fetchAPI<Message[]>(`messages/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store'
        });
    },

    sendMessage: async (receiverId: number | string, content: string, listingId?: number | string) => {
        const token = getAuthToken();
        return fetchAPI<Message>('messages', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                receiver_id: receiverId,
                content,
                listing_id: listingId
            }),
        });
    }
};

/**
 * Helper to get localized name from an object (City, Category, etc.)
 */
export function getLocalizedName(
    item: { name?: string; name_ar?: string; name_fr?: string } | null | undefined,
    locale: string
) {
    if (!item) return '';
    if (locale === 'ar' && item.name_ar) return item.name_ar;
    if (locale === 'fr' && item.name_fr) return item.name_fr;
    return item.name || '';
}
