<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateListingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Check property ownership usually done in Policy, but can be here too.
        // For now return true, Controller will check Policy.
        return true; 
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        // Mostly similar to Store but often 'sometimes'
        // Complex to change category on update, so strictly specific fields usually just 'nullable'
        
        return [
            'category_id' => 'sometimes|exists:categories,id', // Changing category is risky but allowed
            'city_id' => 'nullable|exists:cities,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'price_unit' => 'nullable|string',
            'price_type' => 'nullable|in:daily,hourly,mission,call',
            'location' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'is_available' => 'boolean',
            
            // Allow category specific fields optionally
            'fuel_type' => 'nullable|string',
            'gearbox' => 'nullable|string',
            'seats' => 'nullable|integer',
            'brand' => 'nullable|string',
            'model' => 'nullable|string',
            'tonnage' => 'nullable|string',
            'year' => 'nullable|integer',
            'with_driver' => 'nullable|boolean',
            'capacity' => 'nullable|integer',
            'air_conditioning' => 'nullable|boolean',
            'usage_type' => 'nullable|string',
            'license_type' => 'nullable|string',
            'experience_years' => 'nullable|integer',
        ];
    }
}
