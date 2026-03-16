<?php

namespace App\Http\Requests\Listing;

use Illuminate\Foundation\Http\FormRequest;

class LegacyListingUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'image_hero' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:10240'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,gif', 'max:10240'],
            'existing_images' => ['nullable', 'array'],
            'existing_images.*' => ['string'],
        ];
    }
}
