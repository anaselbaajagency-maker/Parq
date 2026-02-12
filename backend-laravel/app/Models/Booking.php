<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = ['listing_id', 'user_id', 'provider_id', 'start_date', 'end_date', 'total_price', 'status'];

    protected $casts = ['start_date' => 'datetime', 'end_date' => 'datetime'];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }
}
