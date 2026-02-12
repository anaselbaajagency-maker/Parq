<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $fillable = ['name', 'name_fr', 'name_ar', 'slug', 'region', 'country', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function listings()
    {
        return $this->hasMany(Listing::class);
    }
    //
}
