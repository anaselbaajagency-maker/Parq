<?php

namespace App\Http\Requests\Listing;

use Illuminate\Foundation\Http\FormRequest;

class LegacyListingStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'city_id' => ['nullable', 'exists:cities,id'],
            'price' => ['required', 'numeric'],
            'description' => ['required', 'string'],
            'attributes' => ['nullable', 'array'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:10240'],
            'type' => ['nullable', 'string'],
            'brand' => ['nullable', 'string'],
            'model' => ['nullable', 'string'],
            'year' => ['nullable', 'integer'],
            'fuel_type' => ['nullable', 'string'],
            'gearbox' => ['nullable', 'string'],
            'seats' => ['nullable', 'integer'],
            'tonnage' => ['nullable', 'string'],
            'power' => ['nullable', 'string'],
            'condition' => ['nullable', 'string'],
            'with_driver' => ['nullable', 'boolean'],
            'capacity' => ['nullable', 'numeric'],
            'air_conditioning' => ['nullable', 'boolean'],
            'usage_type' => ['nullable', 'string'],
            'license_type' => ['nullable', 'string'],
            'experience_years' => ['nullable', 'integer'],
            'is_available' => ['nullable', 'boolean'],
        ];
    }
}
