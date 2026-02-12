<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingDriver extends Model
{
    protected $fillable = ['listing_id', 'license_type', 'experience_years', 'is_available'];

    protected $casts = ['is_available' => 'boolean'];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }
}
