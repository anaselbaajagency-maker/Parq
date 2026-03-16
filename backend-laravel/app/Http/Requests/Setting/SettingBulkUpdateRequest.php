<?php

namespace App\Http\Requests\Setting;

use Illuminate\Foundation\Http\FormRequest;

class SettingBulkUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'maintenance_mode' => ['sometimes', 'boolean'],
            'maintenance_message' => ['sometimes', 'nullable', 'string', 'max:2000'],
            '*' => ['nullable'],
        ];
    }
}
