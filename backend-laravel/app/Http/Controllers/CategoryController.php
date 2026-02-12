<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = \App\Models\Category::query();

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('active') && $request->active == '1') {
            $query->where('is_active', true);
        }

        return $query->orderBy('order')->get();
    }

    public function homepage()
    {
        // Return categories specifically marked to be shown on homepage
        return \App\Models\Category::where('is_active', true)
            ->where('show_on_homepage', true)
            ->orderBy('order')
            ->get();
    }

    public function bulkUpdateHomepage(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:categories,id',
        ]);

        $ids = $validated['ids'];

        // Reset all categories
        \App\Models\Category::query()->update(['show_on_homepage' => false]);

        // Mark selected as show_on_homepage
        if (! empty($ids)) {
            \App\Models\Category::whereIn('id', $ids)->update(['show_on_homepage' => true]);
        }

        return response()->json(['message' => 'Homepage categories updated successfully']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_fr' => 'nullable|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'slug' => 'required|string|unique:categories,slug',
            'type' => 'required|in:rent,buy',
            'icon' => 'nullable|string',
            'description' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        return \App\Models\Category::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return \App\Models\Category::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $category = \App\Models\Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'name_fr' => 'nullable|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'slug' => 'sometimes|required|string|unique:categories,slug,'.$category->id,
            'type' => 'sometimes|required|in:rent,buy',
            'icon' => 'nullable|string',
            'description' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        $category->update($validated);

        return $category;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = \App\Models\Category::findOrFail($id);
        $category->delete();

        return response()->noContent();
    }
}
