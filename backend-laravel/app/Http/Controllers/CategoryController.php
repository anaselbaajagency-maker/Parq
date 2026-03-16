<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HandlesCacheableJsonResponses;
use App\Http\Requests\Category\CategoryBulkUpdateHomepageRequest;
use App\Http\Requests\Category\CategoryIndexRequest;
use App\Http\Requests\Category\CategoryStoreRequest;
use App\Http\Requests\Category\CategoryUpdateRequest;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    use HandlesCacheableJsonResponses;

    /**
     * Display a listing of the resource.
     */
    public function index(CategoryIndexRequest $request)
    {
        return $this->cacheableJson(
            $request,
            $this->cacheKeyFromRequest('categories:v'.$this->categoriesCacheVersion().':index', $request),
            $this->publicCacheTtlSeconds(),
            function () use ($request) {
                $query = \App\Models\Category::query();

                if ($request->has('type')) {
                    $query->where('type', $request->type);
                }

                if ($request->boolean('active')) {
                    $query->where('is_active', true);
                }

                return $query->withCount('listings')->orderBy('order')->get();
            }
        );
    }

    public function homepage()
    {
        return $this->cacheableJson(
            request(),
            'categories:v'.$this->categoriesCacheVersion().':homepage',
            $this->publicCacheTtlSeconds(),
            function () {
                return \App\Models\Category::where('is_active', true)
                    ->where('show_on_homepage', true)
                    ->orderBy('order')
                    ->get();
            }
        );
    }

    public function bulkUpdateHomepage(CategoryBulkUpdateHomepageRequest $request)
    {
        $ids = $request->validated('ids');

        // Reset all categories
        \App\Models\Category::query()->update(['show_on_homepage' => false]);

        // Mark selected as show_on_homepage
        if (! empty($ids)) {
            \App\Models\Category::whereIn('id', $ids)->update(['show_on_homepage' => true]);
        }
        $this->bumpCategoriesCacheVersion();

        return response()->json(['message' => 'Homepage categories updated successfully']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryStoreRequest $request)
    {
        $validated = $request->validated();

        $category = \App\Models\Category::create($validated);
        $this->bumpCategoriesCacheVersion();

        return $category;
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
    public function update(CategoryUpdateRequest $request, string $id)
    {
        $category = \App\Models\Category::findOrFail($id);

        $validated = $request->validated();

        $category->update($validated);
        $this->bumpCategoriesCacheVersion();

        return $category;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = \App\Models\Category::findOrFail($id);
        $category->delete();
        $this->bumpCategoriesCacheVersion();

        return response()->noContent();
    }

    /**
     * Bulk delete categories.
     */
    public function bulkDestroy(\Illuminate\Http\Request $request)
    {
        $ids = $request->input('ids', []);

        if (!empty($ids)) {
            \App\Models\Category::whereIn('id', $ids)->delete();
            $this->bumpCategoriesCacheVersion();
        }

        return response()->json([
            'success' => true,
            'message' => count($ids) . ' catégorie(s) supprimée(s) avec succès'
        ]);
    }

    private function categoriesCacheVersion(): int
    {
        return (int) Cache::get('categories_cache_version', 1);
    }

    private function bumpCategoriesCacheVersion(): void
    {
        Cache::forever('categories_cache_version', $this->categoriesCacheVersion() + 1);
    }
}
