<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => ['nullable', 'string', 'min:8', 'required_without:google_id'],
            'role' => ['required', 'string', Rule::in(['CLIENT', 'PROVIDER', 'client', 'provider'])],
            'phone' => ['nullable', 'string', 'max:30'],
            'google_id' => ['nullable', 'string', 'max:191'],
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
