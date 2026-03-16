<?php

namespace App\Models;

use CodeIgniter\Model;

class CityModel extends Model
{
    protected $table            = 'cities';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'name',
        'name_fr',
        'name_ar',
        'slug',
        'is_active'
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}
