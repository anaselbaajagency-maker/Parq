<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    protected $fillable = [
        'user_id',
        'category_id',
        'city_id',
        'title',
        'title_fr',
        'title_ar',
        'slug',
        'description',
        'description_fr',
        'description_ar',
        'price',
        'price_unit',
        'price_type',
        'latitude',
        'longitude',
        // 'images', // Deprecated JSON column
        'image_hero',
        'is_available',
        'status',
        'attributes', // Keep for flexible attributes if needed
        'views',
        'daily_cost',
        'is_featured',
        'published_at',
    ];

    protected $casts = [
        'images' => 'array', // Keep for backward compatibility if data exists
        'attributes' => 'array',
        'is_available' => 'boolean',
        'is_featured' => 'boolean',
        'daily_cost' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'published_at' => 'datetime',
    ];

    protected $appends = [
        'main_image',
        'is_favorited',
        'brand',
        'model',
        'year',
        'fuel',
        'power',
        'condition',
    ];

    public function getMainImageAttribute()
    {
        $mainImage = $this->images()->where('is_main', true)->first();
        if ($mainImage) {
            return $mainImage->image_path;
        }

        // Fallback to first image
        $firstImage = $this->images()->orderBy('sort_order')->first();

        return $firstImage ? $firstImage->image_path : null;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    // New Relationships
    public function images()
    {
        return $this->hasMany(ListingImage::class);
    }

    public function car()
    {
        return $this->hasOne(ListingCar::class);
    }

    public function machinery()
    {
        return $this->hasOne(ListingMachinery::class);
    }

    public function transport()
    {
        return $this->hasOne(ListingTransport::class);
    }

    public function driver()
    {
        return $this->hasOne(ListingDriver::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function favoritedByUsers()
    {
        return $this->belongsToMany(User::class, 'favorites', 'listing_id', 'user_id')->withTimestamps();
    }

    public function getIsFavoritedAttribute()
    {
        if (! auth('sanctum')->check()) {
            return false;
        }

        return $this->favoritedByUsers()->where('user_id', auth('sanctum')->id())->exists();
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    // Accessors for flattened attributes (Fiche Technique)

    public function getBrandAttribute()
    {
        return $this->machinery?->brand;
    }

    public function getModelAttribute()
    {
        return $this->machinery?->model;
    }

    public function getYearAttribute()
    {
        return $this->machinery?->year;
    }

    public function getFuelAttribute()
    {
        return $this->car?->fuel_type;
    }

    public function getPowerAttribute()
    {
        return $this->machinery?->power;
    }

    public function getConditionAttribute()
    {
        return $this->machinery?->condition;
    }

    public function getGearboxAttribute()
    {
        return $this->car?->gearbox;
    }

    public function getSeatsAttribute()
    {
        return $this->car?->seats;
    }

    public function getCapacityAttribute()
    {
        return $this->transport?->capacity;
    }
}
