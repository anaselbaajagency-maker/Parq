<?php

namespace App\Controllers;

class Dashboard extends BaseController
{
    public function index()
    {
        $stats = $this->api->get('dashboard/stats');
        
        $data = [
            'title' => 'Tableau de bord - Parq',
            'stats' => $stats['data'] ?? [],
            'user'  => session()->get('user')
        ];

        return view('pages/dashboard/index', $data);
    }

    public function profile()
    {
        $userId = session()->get('user')['id'];
        $profile = $this->api->get("users/profile/{$userId}");

        $data = [
            'title'   => 'Mon Profil - Parq',
            'profile' => $profile['data'] ?? [],
            'user'    => session()->get('user')
        ];

        return view('pages/dashboard/profile', $data);
    }
}
