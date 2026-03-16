<?php

namespace App\Http\Requests\City;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CityUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $cityId = (string) $this->route('id');

        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'name_fr' => ['nullable', 'string', 'max:255'],
            'name_ar' => ['nullable', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', Rule::unique('cities', 'slug')->ignore($cityId)],
            'region' => ['nullable', 'string'],
            'country' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
