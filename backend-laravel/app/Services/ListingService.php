<?php

namespace App\Services;

use App\Models\Listing;
use App\Models\Category;
use App\Models\ListingImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Exception;

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

            return $listing->load(['images', 'car', 'machinery', 'transport', 'driver']);
        });
    }

    public function updateListing(Listing $listing, array $data): Listing
    {
        return DB::transaction(function () use ($listing, $data) {
            $updateData = collect($data)->only([
                'category_id', 'city_id', 'title', 'description', 'price', 
                'price_unit', 'price_type', 'location', 'latitude', 'longitude', 'is_available'
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
            // Ideally we separate image management, but for basic Update:
            if (isset($data['images'])) {
               // Logic depends on frontend implementation. 
               // For simplicity, we assume we receive a list of new/existing images or handle separately.
               // Let's assume specific endpoint for images or append logic. 
               // Here implementation is tricky without clear requirements. 
               // I will add a separate method `syncImages` if needed, 
               // or assume `images` contains full list of valid image paths.
               
               // For now, let's skip full image sync in update unless specified, to avoid accidental deletion.
               // Use separate add/remove endpoints usually better.
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
                    'sort_order' => $index
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
}
