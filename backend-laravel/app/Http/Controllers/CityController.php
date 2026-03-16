<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HandlesCacheableJsonResponses;
use App\Http\Requests\City\CityIndexRequest;
use App\Http\Requests\City\CityStoreRequest;
use App\Http\Requests\City\CityUpdateRequest;
use Illuminate\Support\Facades\Cache;

class CityController extends Controller
{
    use HandlesCacheableJsonResponses;

    /**
     * Display a listing of the resource.
     */
    public function index(CityIndexRequest $request)
    {
        return $this->cacheableJson(
            $request,
            $this->cacheKeyFromRequest('cities:v'.$this->citiesCacheVersion().':index', $request),
            $this->publicCacheTtlSeconds(),
            function () use ($request) {
                if ($request->boolean('active')) {
                    return \App\Models\City::where('is_active', true)->get();
                }

                return \App\Models\City::all();
            }
        );
    }

    public function store(CityStoreRequest $request)
    {
        $validated = $request->validated();

        $city = \App\Models\City::create($validated);
        $this->bumpCitiesCacheVersion();

        return $city;
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return \App\Models\City::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CityUpdateRequest $request, $id)
    {
        $city = \App\Models\City::findOrFail($id);

        $validated = $request->validated();

        $city->update($validated);
        $this->bumpCitiesCacheVersion();

        return $city;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $city = \App\Models\City::findOrFail($id);
        $city->delete();
        $this->bumpCitiesCacheVersion();

        return response()->noContent();
    }

    /**
     * Bulk delete cities.
     */
    public function bulkDestroy(\Illuminate\Http\Request $request)
    {
        $ids = $request->input('ids', []);
        
        if (!empty($ids)) {
            \App\Models\City::whereIn('id', $ids)->delete();
            $this->bumpCitiesCacheVersion();
        }

        return response()->json([
            'success' => true,
            'message' => count($ids) . ' ville(s) supprimée(s) avec succès'
        ]);
    }

    private function citiesCacheVersion(): int
    {
        return (int) Cache::get('cities_cache_version', 1);
    }

    private function bumpCitiesCacheVersion(): void
    {
        Cache::forever('cities_cache_version', $this->citiesCacheVersion() + 1);
    }
}
