<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use App\Libraries\JWTAuth;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $token = JWTAuth::extractToken();

        if (!$token) {
            return service('response')
                ->setStatusCode(401)
                ->setJSON(['message' => 'Unauthenticated.']);
        }

        $jwt = new JWTAuth();
        $decoded = $jwt->validateToken($token);

        if (!$decoded) {
            return service('response')
                ->setStatusCode(401)
                ->setJSON(['message' => 'Invalid or expired token.']);
        }

        // Store user ID in request for controllers to use
        $request->userId = (int) $decoded->sub;
        $request->tokenAbilities = $decoded->abilities ?? [];
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // No action needed
    }
}
