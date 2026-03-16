<?php

namespace App\Models;

use CodeIgniter\Model;

class ListingModel extends Model
{
    protected $table            = 'listings';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;
    protected $protectFields    = true;
    protected $allowedFields    = [
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
        'images',
        'image_hero',
        'is_available',
        'status',
        'attributes',
        'views',
        'daily_cost',
        'is_featured',
        'published_at'
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // JSON Casting emulation for CI4
    protected $afterFind = ['castJsonFields'];

    protected function castJsonFields(array $data)
    {
        if (isset($data['data'])) {
            $item = &$data['data'];
            if (isset($item['images']) && is_string($item['images'])) {
                $item['images'] = json_decode($item['images'], true);
            }
            if (isset($item['attributes']) && is_string($item['attributes'])) {
                $item['attributes'] = json_decode($item['attributes'], true);
            }
        } else {
            foreach ($data as &$item) {
                if (isset($item['images']) && is_string($item['images'])) {
                    $item['images'] = json_decode($item['images'], true);
                }
                if (isset($item['attributes']) && is_string($item['attributes'])) {
                    $item['attributes'] = json_decode($item['attributes'], true);
                }
            }
        }

        return $data;
    }
}
