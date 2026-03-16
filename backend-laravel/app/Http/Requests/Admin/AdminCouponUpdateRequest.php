<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminCouponUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $couponId = (int) $this->route('id');

        return [
            'code' => ['sometimes', 'string', 'min:3', 'max:20', Rule::unique('coupons', 'code')->ignore($couponId)],
            'credit_amount' => ['sometimes', 'integer', 'min:1', 'max:10000'],
            'max_uses' => ['sometimes', 'integer', 'min:1'],
            'expires_at' => ['nullable', 'date'],
            'description' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
