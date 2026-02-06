<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingCar extends Model
{
    protected $fillable = ['listing_id', 'fuel_type', 'gearbox', 'seats'];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }
}
