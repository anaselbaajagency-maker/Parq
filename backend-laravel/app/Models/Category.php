<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'name_fr', 'name_ar', 'slug', 'type', 'icon', 'description', 'description_fr', 'description_ar', 'parent_id', 'order', 'is_active', 'schema_template', 'show_on_homepage', 'daily_cost'];

    protected $casts = ['schema_template' => 'array', 'is_active' => 'boolean', 'show_on_homepage' => 'boolean', 'daily_cost' => 'integer'];

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function listings()
    {
        return $this->hasMany(Listing::class);
    }
}
