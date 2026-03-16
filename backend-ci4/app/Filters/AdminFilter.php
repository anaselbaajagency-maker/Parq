<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use App\Models\UserModel;

class AdminFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $userId = $request->userId ?? null;

        if (!$userId) {
            return service('response')
                ->setStatusCode(401)
                ->setJSON(['message' => 'Unauthenticated.']);
        }

        $userModel = new UserModel();
        $user = $userModel->find($userId);

        if (!$user || strtoupper($user['role']) !== 'ADMIN') {
            return service('response')
                ->setStatusCode(403)
                ->setJSON(['message' => 'Access denied. Admin role required.']);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // No action needed
    }
}
