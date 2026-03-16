<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminCouponIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'active_only' => ['sometimes', 'boolean'],
            'valid_only' => ['sometimes', 'boolean'],
        ];
    }
}
