<?php

namespace App\Http\Requests\Wallet;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class WalletTransactionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'limit' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'offset' => ['sometimes', 'integer', 'min:0'],
            'type' => ['sometimes', 'string', Rule::in([
                'bonus',
                'topup_manual',
                'online_payment',
                'deduction',
                'coupon',
                'admin_credit',
                'credit',
                'debit',
            ])],
        ];
    }
}
