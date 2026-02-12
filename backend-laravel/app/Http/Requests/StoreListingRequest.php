<?php

namespace App\Http\Requests;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;

class StoreListingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Auth handled by middleware usually
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'category_id' => 'required|exists:categories,id',
            'city_id' => 'nullable|exists:cities,id', // Make nullable if not checking user/city strict
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'price_unit' => 'nullable|string',
            'price_type' => 'nullable|in:daily,hourly,mission,call',
            'location' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'images' => 'nullable|array',
            'images' => 'nullable|array',
            'images.*' => 'image|max:5120', // Allow image files up to 5MB
        ];

        // Conditional Validation based on Category Type
        if ($this->has('category_id')) {
            $category = Category::find($this->category_id);
            if ($category) {
                switch ($category->type) {
                    case 'car_rental':
                    case 'listing_cars':
                        $rules += [
                            'fuel_type' => 'nullable|string',
                            'gearbox' => 'nullable|string',
                            'seats' => 'nullable|integer',
                        ];
                        break;
                    case 'machinery':
                    case 'listing_machinery':
                        $rules += [
                            'brand' => 'nullable|string',
                            'model' => 'nullable|string',
                            'tonnage' => 'nullable|string',
                            'year' => 'nullable|integer',
                            'with_driver' => 'nullable|boolean',
                        ];
                        break;
                    case 'transport':
                    case 'listing_transports':
                        $rules += [
                            'capacity' => 'nullable|integer',
                            'air_conditioning' => 'nullable|boolean',
                            'usage_type' => 'nullable|string',
                        ];
                        break;
                    case 'driver':
                    case 'listing_drivers':
                        $rules += [
                            'license_type' => 'nullable|string',
                            'experience_years' => 'nullable|integer',
                        ];
                        break;
                }
            }
        }

        return $rules;
    }
}
