<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingTransport extends Model
{
    protected $fillable = ['listing_id', 'capacity', 'air_conditioning', 'usage_type'];
    protected $casts = ['air_conditioning' => 'boolean'];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }
}
