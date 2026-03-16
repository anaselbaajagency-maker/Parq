<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class DeleteAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'confirm_email' => ['nullable', 'email'],
            'reason' => ['nullable', 'string', 'max:255'],
        ];
    }
}
