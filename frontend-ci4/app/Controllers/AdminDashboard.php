<?php

namespace App\Controllers;

class AdminDashboard extends BaseController
{
    public function initController(\CodeIgniter\HTTP\RequestInterface $request, \CodeIgniter\HTTP\ResponseInterface $response, \Psr\Log\LoggerInterface $logger)
    {
        parent::initController($request, $response, $logger);
        
        // Ensure user is admin
        $user = session()->get('user');
        if (!$user || $user['role'] !== 'admin') {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }
    }

    public function index()
    {
        $stats = $this->api->get('admin/stats');
        $users = $this->api->get('admin/users');

        $data = [
            'title' => 'Administration - Parq',
            'stats' => $stats['data'] ?? [],
            'users' => $users['data'] ?? [],
            'user'  => session()->get('user')
        ];

        return view('pages/admin/index', $data);
    }
}
