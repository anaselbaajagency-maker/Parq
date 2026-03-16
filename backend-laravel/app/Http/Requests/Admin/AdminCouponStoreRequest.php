<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminCouponStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'min:3', 'max:20', 'unique:coupons,code'],
            'credit_amount' => ['required', 'integer', 'min:1', 'max:10000'],
            'max_uses' => ['sometimes', 'integer', 'min:1'],
            'expires_at' => ['nullable', 'date', 'after:now'],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
