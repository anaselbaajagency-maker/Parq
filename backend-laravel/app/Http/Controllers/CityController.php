<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->has('active') && $request->active == '1') {
            return \App\Models\City::where('is_active', true)->get();
        }
        return \App\Models\City::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_fr' => 'nullable|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'slug' => 'required|string|unique:cities,slug',
            'region' => 'nullable|string',
            'country' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        return \App\Models\City::create($validated);
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
    public function update(Request $request, $id)
    {
        $city = \App\Models\City::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'name_fr' => 'nullable|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'slug' => 'sometimes|string|unique:cities,slug,' . $id,
            'region' => 'nullable|string',
            'country' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $city->update($validated);
        return $city;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $city = \App\Models\City::findOrFail($id);
        $city->delete();
        return response()->noContent();
    }
}
