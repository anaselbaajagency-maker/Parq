<?php

namespace App\Http\Requests\Admin;

use App\Models\TopUpRequest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class AdminTopupFiltersRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', 'string', Rule::in(TopUpRequest::getStatuses())],
            'method' => ['sometimes', 'string', Rule::in(TopUpRequest::getMethods())],
            'user_id' => ['sometimes', 'integer', 'exists:users,id'],
            'from_date' => ['sometimes', 'date'],
            'to_date' => ['sometimes', 'date'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $from = $this->input('from_date');
            $to = $this->input('to_date');

            if (! $from || ! $to) {
                return;
            }

            if (strtotime((string) $from) > strtotime((string) $to)) {
                $validator->errors()->add('to_date', 'The to_date must be greater than or equal to from_date.');
            }
        });
    }
}
