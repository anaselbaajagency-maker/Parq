<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingMachinery extends Model
{
    protected $table = 'listing_machineries';

    protected $fillable = ['listing_id', 'brand', 'model', 'tonnage', 'year', 'power', 'condition', 'with_driver'];

    protected $casts = ['with_driver' => 'boolean'];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }
}
