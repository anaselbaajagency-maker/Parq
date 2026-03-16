<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'receiver_id' => ['required', 'exists:users,id'],
            'content' => ['required', 'string', 'max:5000'],
            'listing_id' => ['nullable', 'exists:listings,id'],
        ];
    }
}
