<?php

namespace App\Controllers;

use App\Libraries\ApiClient;

class Home extends BaseController
{
    protected ApiClient $api;

    public function __construct()
    {
        $this->api = new ApiClient();
    }

    public function index(): string
    {
        // Fetch featured listings and categories from Backend CI4
        $listingsResult = $this->api->get('homepage/listings');
        $categoriesResult = $this->api->get('categories/homepage');

        $data = [
            'title'      => 'Parq - Louez plus que du stationnement',
            'listings'   => $listingsResult['data'] ?? [],
            'categories' => $categoriesResult['data'] ?? [],
            'locale'     => session()->get('locale') ?? 'fr',
        ];

        return view('pages/home', $data);
    }
}
