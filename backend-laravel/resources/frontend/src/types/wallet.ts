export type TransactionType = 'bonus' | 'topup' | 'deduction' | 'refund';
export type PaymentMethod = 'cmi' | 'bank_transfer' | 'payzone' | 'cash_plus' | 'coupon';
export type TopUpStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface WalletBalance {
    balance: number;
    currency: string;
    daily_expense: number;
    days_remaining: number;
    low_balance_warning: boolean;
    critical_balance_warning: boolean;
}

export interface Transaction {
    id: number;
    type: TransactionType;
    amount: number;
    description: string;
    description_ar?: string;
    reference?: string;
    listing_id?: number | null;
    listing_title?: string | null;
    created_at: string;
    status: 'completed' | 'pending' | 'failed';
    receipt_url?: string | null;
}

export interface TopUpRequest {
    id: number;
    method: PaymentMethod;
    amount: number;
    status: TopUpStatus;
    reference: string;
    instructions?: string;
    instructions_ar?: string;
    rib?: string;
    payment_code?: string;
    created_at: string;
}
