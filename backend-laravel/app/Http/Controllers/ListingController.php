<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\ListingCar;
use App\Models\ListingDriver;
use App\Models\ListingMachinery;
use App\Models\ListingTransport;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class ListingController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum', only: ['store', 'update', 'destroy', 'pause', 'toggleFavorite']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Listing::with(['category', 'city', 'user', 'car', 'machinery', 'transport', 'driver']);

        // Filter by Status (default active unless own user?)
        $query->where('status', 'active');

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        // ... (rest of filtering)

        if ($request->has('category')) { // Category Slug or ID
            $category = $request->category;
            $query->whereHas('category', function ($q) use ($category) {
                $q->where('id', $category)->orWhere('slug', $category);
            });
        }

        if ($request->has('city')) { // City Slug or ID
            $city = $request->city;
            $query->whereHas('city', function ($q) use ($city) {
                $q->where('id', $city)->orWhere('slug', $city);
            });
        }

        if ($request->has('type')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('type', $request->type);
            });
        }

        $perPage = $request->get('limit', 15);

        return $query->paginate($perPage);
    }

    public function adminIndex(Request $request)
    {
        // Admin sees ALL listings (active, inactive, pending)
        $query = Listing::with(['category', 'city', 'user', 'car', 'machinery', 'transport', 'driver'])
            ->orderBy('created_at', 'desc');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return $query->paginate(20);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'city_id' => 'nullable|exists:cities,id',
            'price' => 'required|numeric',
            'description' => 'required|string',
            'attributes' => 'nullable|array',
            'images' => 'nullable|array',
            'images.*' => 'image|max:10240', // Increased to 10MB
            'type' => 'nullable|string', // rent/buy

            // Technical Specs (Optional based on category)
            'brand' => 'nullable|string',
            'model' => 'nullable|string',
            'year' => 'nullable|integer',
            'fuel_type' => 'nullable|string',
            'gearbox' => 'nullable|string',
            'seats' => 'nullable|integer',
            'tonnage' => 'nullable|string',
            'power' => 'nullable|string',
            'condition' => 'nullable|string',
            'with_driver' => 'nullable|boolean',
            'capacity' => 'nullable|numeric',
            'air_conditioning' => 'nullable|boolean',
            'usage_type' => 'nullable|string',
            'license_type' => 'nullable|string',
            'experience_years' => 'nullable|integer',
            'is_available' => 'nullable|boolean',
        ]);

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('listings', 'public');
                $url = asset('storage/'.$path);
                $imagePaths[] = $url;
            }
        }

        $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']).'-'.uniqid();
        $validated['user_id'] = auth()->id(); // Strict: User must be logged in (handled by middleware)
        $validated['status'] = 'active'; // Default active
        $validated['images'] = $imagePaths;

        // Set image_hero to the first image if available
        if (!empty($imagePaths)) {
            $validated['image_hero'] = $imagePaths[0];
        }

        $listing = Listing::create($validated);

        // Handle Specifics
        // Determine type based on category type or explicit input if available
        $categoryType = $listing->category->type ?? 'unknown'; // assuming category relationship exists or fetched

        // Create related models
        if ($request->hasAny(['fuel_type', 'gearbox', 'seats'])) {
            ListingCar::create([
                'listing_id' => $listing->id,
                'fuel_type' => $request->fuel_type,
                'gearbox' => $request->gearbox,
                'seats' => $request->seats,
            ]);
        }

        if ($request->hasAny(['brand', 'model', 'tonnage', 'year', 'power', 'condition'])) {
            ListingMachinery::create([
                'listing_id' => $listing->id,
                'brand' => $request->brand,
                'model' => $request->model,
                'tonnage' => $request->tonnage,
                'year' => $request->year,
                'power' => $request->power,
                'condition' => $request->condition,
                'with_driver' => $request->boolean('with_driver'),
            ]);
        }

        if ($request->hasAny(['capacity', 'usage_type'])) {
            ListingTransport::create([
                'listing_id' => $listing->id,
                'capacity' => $request->capacity,
                'air_conditioning' => $request->boolean('air_conditioning'),
                'usage_type' => $request->usage_type,
            ]);
        }

        if ($request->hasAny(['license_type', 'experience_years'])) {
            ListingDriver::create([
                'listing_id' => $listing->id,
                'license_type' => $request->license_type,
                'experience_years' => $request->experience_years,
                'is_available' => $request->boolean('is_available'),
            ]);
        }

        return $listing->load(['car', 'machinery', 'transport', 'driver']);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $query = Listing::with(['category', 'city', 'user', 'reviews', 'car', 'machinery', 'transport', 'driver']);

        if (is_numeric($id)) {
            $listing = $query->findOrFail($id);
        } else {
            $listing = $query->where('slug', $id)->firstOrFail();
        }

        return $listing;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Listing $listing)
    {
        $this->authorize('update', $listing);

        $validated = $request->except(['images', 'image_hero', 'existing_images']);

        // Handle Image Hero
        if ($request->hasFile('image_hero')) {
            $path = $request->file('image_hero')->store('listings', 'public');
            $validated['image_hero'] = asset('storage/' . $path);
        }

        // Handle Gallery Images (Merge Existing + New)
        $currentImages = $request->input('existing_images', []);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('listings', 'public');
                $currentImages[] = asset('storage/' . $path);
            }
        }
        
        // Ensure hero image is also in the main images list if it was updated/uploaded (optional per business logic, but safe)
        if (isset($validated['image_hero']) && !in_array($validated['image_hero'], $currentImages)) {
             array_unshift($currentImages, $validated['image_hero']);
        }

        $validated['images'] = $currentImages;

        // Validate images if new ones are uploaded
        if ($request->hasFile('images')) {
            $request->validate([
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:10240',
            ]);
        }

        $listing->update($validated);

        // Update related models
        if ($request->hasAny(['fuel_type', 'gearbox', 'seats'])) {
            $listing->car()->updateOrCreate([], [
                'fuel_type' => $request->fuel_type,
                'gearbox' => $request->gearbox,
                'seats' => $request->seats,
            ]);
        }

        if ($request->hasAny(['brand', 'model', 'tonnage', 'year', 'power', 'condition', 'with_driver'])) {
            $listing->machinery()->updateOrCreate([], [
                'brand' => $request->brand,
                'model' => $request->model,
                'tonnage' => $request->tonnage,
                'year' => $request->year,
                'power' => $request->power,
                'condition' => $request->condition,
                'with_driver' => $request->boolean('with_driver'),
            ]);
        }

        if ($request->hasAny(['capacity', 'usage_type', 'air_conditioning'])) {
            $listing->transport()->updateOrCreate([], [
                'capacity' => $request->capacity,
                'air_conditioning' => $request->boolean('air_conditioning'),
                'usage_type' => $request->usage_type,
            ]);
        }

        if ($request->hasAny(['license_type', 'experience_years', 'is_available'])) {
            $listing->driver()->updateOrCreate([], [
                'license_type' => $request->license_type,
                'experience_years' => $request->experience_years,
                'is_available' => $request->boolean('is_available'),
            ]);
        }

        return $listing->load(['car', 'machinery', 'transport', 'driver']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Listing $listing)
    {
        $this->authorize('delete', $listing);
        $listing->delete();

        return response()->noContent();
    }

    public function getByCategory(Request $request, $category)
    {
        $query = Listing::with(['category', 'city', 'user'])
            ->where('status', 'active');

        // Check if $category is numeric ID or Slug
        if (is_numeric($category)) {
            $query->where('category_id', $category);
        } else {
            $query->whereHas('category', function ($q) use ($category) {
                $q->where('slug', $category);
            });
        }

        if ($request->has('city')) {
            $city = $request->city;
            $query->whereHas('city', function ($q) use ($city) {
                $q->where('id', $city)->orWhere('slug', $city);
            });
        }

        $perPage = $request->get('limit', 15);

        return $query->paginate($perPage);
    }

    public function homepage()
    {
        // Return latest active listings for homepage
        $listings = Listing::with(['category', 'city', 'user'])
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();

        return [
            'latest' => $listings,
            'featured' => $listings->take(4),
        ];
    }
}
