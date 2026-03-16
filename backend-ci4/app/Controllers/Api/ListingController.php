<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\ListingModel;
use App\Models\CategoryModel;
use App\Models\CityModel;
use CodeIgniter\API\ResponseTrait;

class ListingController extends BaseController
{
    use ResponseTrait;

    protected $listingModel;

    public function __construct()
    {
        $this->listingModel = new ListingModel();
    }

    /**
     * GET /api/listings
     */
    public function index()
    {
        $query = $this->listingModel;

        if ($userId = $this->request->getVar('user_id')) {
            $query = $query->where('user_id', $userId);
        }

        if ($categoryId = $this->request->getVar('category_id')) {
            $query = $query->where('category_id', $categoryId);
        }

        if ($cityId = $this->request->getVar('city_id')) {
            $query = $query->where('city_id', $cityId);
        }

        // Add more filters and sorting like Laravel
        $listings = $query->orderBy('created_at', 'desc')->findAll();

        return $this->respond($listings);
    }

    /**
     * GET /api/listings/{id}
     */
    public function show($id)
    {
        $listing = is_numeric($id) 
            ? $this->listingModel->find($id) 
            : $this->listingModel->where('slug', $id)->first();

        if (!$listing) {
            return $this->failNotFound('Listing not found');
        }

        // Logic for visibility rules (admin/owner check) missing for now
        return $this->respond($listing);
    }

    /**
     * POST /api/listings
     */
    public function store()
    {
        $userId = $this->request->userId;
        $data = $this->request->getJSON(true);
        $data['user_id'] = $userId;
        $data['status'] = 'pending';

        $listingId = $this->listingModel->insert($data);
        return $this->respondCreated($this->listingModel->find($listingId));
    }

    /**
     * POST /api/listings/{id}/view
     */
    public function recordView($id)
    {
        $listing = is_numeric($id) 
            ? $this->listingModel->find($id) 
            : $this->listingModel->where('slug', $id)->first();

        if (!$listing) {
            return $this->failNotFound('Listing not found');
        }

        $this->listingModel->update($listing['id'], [
            'views' => $listing['views'] + 1
        ]);

        return $this->respond(['views' => $listing['views'] + 1]);
    }
}
