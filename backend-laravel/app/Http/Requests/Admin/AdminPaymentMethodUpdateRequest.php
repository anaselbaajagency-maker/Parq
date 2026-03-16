<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminPaymentMethodUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'name_ar' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer'],
            'config' => ['nullable', 'array'],
            'icon' => ['nullable', 'string', 'max:50'],
        ];
    }
}
