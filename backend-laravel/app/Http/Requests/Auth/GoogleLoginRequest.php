<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GoogleLoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'google_id' => ['required', 'string', 'max:191'],
            'full_name' => ['required', 'string', 'max:255'],
            'avatar' => ['nullable', 'string', 'max:2048'],
            'client_type' => ['nullable', 'string', Rule::in(['web', 'mobile'])],
            'device_name' => ['nullable', 'string', 'max:100'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $email = $this->input('email');

        $this->merge([
            'email' => is_string($email) ? strtolower(trim($email)) : $email,
        ]);
    }
}
