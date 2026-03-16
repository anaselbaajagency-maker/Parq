<?php

namespace App\Controllers;

class Listing extends BaseController
{
    public function index()
    {
        $query = $this->request->getGet();
        $result = $this->api->get('listings', $query);

        $data = [
            'title'    => 'Parq - Explorez les stationnements',
            'listings' => $result['data'] ?? [],
            'filters'  => $query
        ];

        return view('pages/listings/index', $data);
    }

    public function show($id)
    {
        $result = $this->api->get("listings/{$id}");
        
        if ($result['status'] === 404) {
             throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }

        $data = [
            'title'   => ($result['data']['title_fr'] ?? $result['data']['title']) . ' - Parq',
            'listing' => $result['data']
        ];

        return view('pages/listings/show', $data);
    }
}
