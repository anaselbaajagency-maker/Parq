<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoryId = (string) $this->route('id');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'name_fr' => ['nullable', 'string', 'max:255'],
            'name_ar' => ['nullable', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('categories', 'slug')->ignore($categoryId)],
            'type' => ['sometimes', 'required', 'in:rent,buy'],
            'icon' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'description_fr' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
            'order' => ['sometimes', 'integer'],
            'daily_cost' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
