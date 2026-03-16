<?php

namespace App\Http\Requests\Wallet;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class WalletTopupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $min = (int) config('wallet.minimum_topup', 50);
        $max = (int) config('wallet.maximum_topup', 10000);

        return [
            'amount' => ['required', 'integer', "min:{$min}", "max:{$max}"],
            'method' => ['required', 'string', Rule::in(['bank_transfer', 'cmi', 'payzone', 'cashplus'])],
            'proof_image' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:5120'],
        ];
    }
}
