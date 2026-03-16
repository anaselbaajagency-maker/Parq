<?php

namespace App\Libraries;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\UserModel;

class JWTAuth
{
    protected string $secret;
    protected int $expiration;

    public function __construct()
    {
        $this->secret = env('jwt.secret', 'default_secret_key');
        $this->expiration = (int) env('jwt.expiration', 43200); // 30 days in minutes
    }

    /**
     * Generate a JWT token for a user.
     */
    public function generateToken(int $userId, string $deviceName = 'mobile-app', array $abilities = ['mobile']): string
    {
        $issuedAt = time();
        $expiresAt = $issuedAt + ($this->expiration * 60);

        $payload = [
            'iss' => base_url(),
            'iat' => $issuedAt,
            'exp' => $expiresAt,
            'sub' => $userId,
            'device_name' => $deviceName,
            'abilities' => $abilities,
        ];

        return JWT::encode($payload, $this->secret, 'HS256');
    }

    /**
     * Validate and decode a JWT token.
     */
    public function validateToken(string $token): ?object
    {
        try {
            return JWT::decode($token, new Key($this->secret, 'HS256'));
        } catch (\Exception $e) {
            log_message('debug', 'JWT validation failed: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get user ID from token.
     */
    public function getUserIdFromToken(string $token): ?int
    {
        $decoded = $this->validateToken($token);
        return $decoded ? (int) $decoded->sub : null;
    }

    /**
     * Get user from token.
     */
    public function getUserFromToken(string $token): ?array
    {
        $userId = $this->getUserIdFromToken($token);
        if (!$userId) {
            return null;
        }

        $userModel = new UserModel();
        return $userModel->find($userId);
    }

    /**
     * Extract Bearer token from Authorization header.
     */
    public static function extractToken(): ?string
    {
        $request = service('request');
        $authHeader = $request->getHeaderLine('Authorization');

        if (empty($authHeader)) {
            return null;
        }

        if (preg_match('/Bearer\s+(.+)$/i', $authHeader, $matches)) {
            return $matches[1];
        }

        return null;
    }
}
