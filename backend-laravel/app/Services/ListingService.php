<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Listing;
use App\Models\ListingImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ListingService
{
    public function createListing(array $data, int $userId): Listing
    {
        return DB::transaction(function () use ($data, $userId) {
            $category = Category::findOrFail($data['category_id']);

            // Prepare main listing data
            $listingData = [
                'user_id' => $userId,
                'category_id' => $data['category_id'],
                'city_id' => $data['city_id'] ?? null,
                'title' => $data['title'],
                'slug' => $this->generateSlug($data['title']),
                'description' => $data['description'] ?? null,
                'price' => $data['price'],
                'price_unit' => $data['price_unit'] ?? 'DH/day',
                'price_type' => $data['price_type'] ?? 'daily',
                'location' => $data['location'] ?? null,
                'latitude' => $data['latitude'] ?? null,
                'longitude' => $data['longitude'] ?? null,
                'status' => 'pending', // Default status
                'is_available' => true,
                'daily_cost' => $category->daily_cost, // Snapshot cost
                'published_at' => now(),
            ];

            $listing = Listing::create($listingData);

            // Handle Category Specific Tables
            $this->handleCategorySpecificData($listing, $category->type, $data);

            // Handle Images
            if (isset($data['images']) && is_array($data['images'])) {
                $this->handleImages($listing, $data['images']);
            }

            // Notify admins
            $admins = \App\Models\User::where('role', 'ADMIN')->get();
            foreach ($admins as $admin) {
                $admin->notify(new \App\Notifications\NewListingNotification($listing));
            }

            return $listing->load(['images', 'car', 'machinery', 'transport', 'driver']);
        });
    }

    public function updateListing(Listing $listing, array $data): Listing
    {
        return DB::transaction(function () use ($listing, $data) {
            $updateData = collect($data)->only([
                'category_id', 'city_id', 'title', 'description', 'price',
                'price_unit', 'price_type', 'location', 'latitude', 'longitude', 'is_available',
            ])->toArray();

            if (isset($data['title']) && $data['title'] !== $listing->title) {
                $updateData['slug'] = $this->generateSlug($data['title']);
            }

            $listing->update($updateData);

            // Check if category changed (unlikely/complex business rule, usually discouraged, but handled)
            $category = Category::find($data['category_id'] ?? $listing->category_id);

            // If category matches, update specific data
            if ($category->id === $listing->category_id) {
                // Determine type from category, if relation doesn't exist create it, else update
                $this->handleCategorySpecificData($listing, $category->type, $data);
            }

            // Handle Images (Sync: Replace all or Add/Remove specific? For API assume replace list or specific endpoint)
            if ($listing->id) {
                $this->syncImages($listing, $data);
            }

            return $listing->fresh(['images', 'car', 'machinery', 'transport', 'driver']);
        });
    }

    protected function handleCategorySpecificData(Listing $listing, string $type, array $data)
    {
        switch ($type) {
            case 'car_rental':
            case 'listing_cars': // Fallback if type naming varies
                $listing->car()->updateOrCreate(
                    ['listing_id' => $listing->id],
                    collect($data)->only(['fuel_type', 'gearbox', 'seats'])->toArray()
                );
                break;

            case 'machinery':
            case 'listing_machinery':
                $listing->machinery()->updateOrCreate(
                    ['listing_id' => $listing->id],
                    collect($data)->only(['brand', 'model', 'tonnage', 'year', 'with_driver'])->toArray()
                );
                break;

            case 'transport':
            case 'listing_transports':
                $listing->transport()->updateOrCreate(
                    ['listing_id' => $listing->id],
                    collect($data)->only(['capacity', 'air_conditioning', 'usage_type'])->toArray()
                );
                break;

            case 'driver':
            case 'listing_drivers':
                $listing->driver()->updateOrCreate(
                    ['listing_id' => $listing->id],
                    collect($data)->only(['license_type', 'experience_years', 'is_available'])->toArray()
                );
                break;
        }
    }

    protected function handleImages(Listing $listing, array $images)
    {
        // $images expects array of objects or strings?
        // Let's assume array of ['path' => '...', 'is_main' => bool]

        // If just array of strings
        foreach ($images as $index => $imageData) {
            if (is_string($imageData)) {
                $path = $imageData;
                $isMain = $index === 0;
            } else {
                $path = $imageData['path'] ?? $imageData['image_path'] ?? null;
                $isMain = $imageData['is_main'] ?? ($index === 0);
            }

            if ($path) {
                ListingImage::create([
                    'listing_id' => $listing->id,
                    'image_path' => $path,
                    'is_main' => $isMain,
                    'sort_order' => $index,
                ]);
            }
        }
    }

    protected function generateSlug($title)
    {
        $slug = Str::slug($title);
        $count = Listing::where('slug', 'LIKE', "{$slug}%")->count();

        return $count ? "{$slug}-{$count}" : $slug;
    }

    protected function syncImages(Listing $listing, array $data)
    {
        $currentImageUrls = $data['existing_images'] ?? [];
        $heroUrl = $listing->image_hero;

        // 1. Handle New Hero Image
        if (isset($data['image_hero'])) {
            $file = $data['image_hero'];
            $path = $file->store('listings', 'public');
            $heroUrl = asset('storage/'.$path);
            $listing->image_hero = $heroUrl;
            // Also ensure it's in the images list
            if (! in_array($heroUrl, $currentImageUrls)) {
                array_unshift($currentImageUrls, $heroUrl);
            }
        }

        // 2. Handle New Gallery Images
        if (isset($data['images']) && is_array($data['images'])) {
            foreach ($data['images'] as $file) {
                if ($file instanceof \Illuminate\Http\UploadedFile) {
                    $path = $file->store('listings', 'public');
                    $currentImageUrls[] = asset('storage/'.$path);
                }
            }
        }

        // 3. Update Listing JSON column
        $listing->images = $currentImageUrls;
        if (isset($heroUrl)) {
            $listing->image_hero = $heroUrl;
        }
        $listing->save();

        // 4. Sync with ListingImages table
        // Delete images that are no longer in the list
        ListingImage::where('listing_id', $listing->id)
            ->whereNotIn('image_path', $currentImageUrls)
            ->delete();

        // Add new images to the table
        foreach ($currentImageUrls as $index => $path) {
            ListingImage::updateOrCreate(
                ['listing_id' => $listing->id, 'image_path' => $path],
                ['is_main' => ($path === $heroUrl), 'sort_order' => $index]
            );
        }
    }
}
