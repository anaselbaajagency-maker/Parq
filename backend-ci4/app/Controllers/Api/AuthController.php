<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserModel;
use App\Libraries\JWTAuth;
use CodeIgniter\API\ResponseTrait;

class AuthController extends BaseController
{
    use ResponseTrait;

    protected $userModel;
    protected $jwt;

    public function __construct()
    {
        $this->userModel = new UserModel();
        $this->jwt = new JWTAuth();
    }

    /**
     * POST /api/register
     */
    public function register()
    {
        $rules = [
            'full_name' => 'required|min_length[3]',
            'email'     => 'required|valid_email|is_unique[users.email]',
            'password'  => 'permit_empty|min_length[8]',
            'role'      => 'required',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = $this->request->getJSON(true);
        
        $userRole = strtolower($data['role']) === 'client' ? 'user' : strtolower($data['role']);

        $user = [
            'full_name' => $data['full_name'],
            'email'     => $data['email'],
            'password'  => !empty($data['password']) ? password_hash($data['password'], PASSWORD_BCRYPT) : null,
            'role'      => $userRole,
            'phone'     => $data['phone'] ?? null,
            'google_id' => $data['google_id'] ?? null,
            'avatar'    => $data['avatar'] ?? null,
        ];

        if (!empty($data['google_id'])) {
            $user['email_verified_at'] = date('Y-m-d H:i:s');
        }

        $userId = $this->userModel->insert($user);
        $userData = $this->userModel->find($userId);
        
        // Remove password from response
        unset($userData['password']);

        $token = $this->jwt->generateToken($userId, $data['device_name'] ?? 'mobile-app');

        return $this->respondCreated([
            'success' => true,
            'message' => 'Registration successful',
            'user'    => $userData,
            'token'   => $token,
        ]);
    }

    /**
     * POST /api/login
     */
    public function login()
    {
        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = $this->request->getJSON(true);
        $user = $this->userModel->where('email', $data['email'])->first();

        if (!$user || !password_verify($data['password'], $user['password'])) {
            return $this->failUnauthorized('Identifiants incorrects.');
        }

        $userId = (int) $user['id'];
        unset($user['password']);

        $token = $this->jwt->generateToken($userId, $data['device_name'] ?? 'mobile-app');

        return $this->respond([
            'success' => true,
            'message' => 'Login successful',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    /**
     * POST /api/logout
     */
    public function logout()
    {
        // For JWT, logout is usually client-side, but we can return success
        return $this->respond([
            'success' => true,
            'message' => 'Logged out',
        ]);
    }

    /**
     * GET /api/user
     */
    public function user()
    {
        $userId = $this->request->userId;
        $user = $this->userModel->find($userId);

        if (!$user) {
            return $this->failNotFound('User not found');
        }

        unset($user['password']);

        return $this->respond($user);
    }

    /**
     * POST /api/auth/google-login
     */
    public function googleLogin()
    {
        $data = $this->request->getJSON(true);
        $user = $this->userModel->where('email', $data['email'])->first();

        if ($user) {
            if (!$user['google_id']) {
                $this->userModel->update($user['id'], ['google_id' => $data['google_id']]);
            }
        } else {
            $user = [
                'full_name' => $data['full_name'],
                'email'     => $data['email'],
                'google_id' => $data['google_id'],
                'avatar'    => $data['avatar'] ?? null,
                'password'  => null,
                'role'      => 'user',
                'email_verified_at' => date('Y-m-d H:i:s'),
            ];
            $userId = $this->userModel->insert($user);
            $user = $this->userModel->find($userId);
        }

        unset($user['password']);
        $token = $this->jwt->generateToken((int)$user['id'], $data['device_name'] ?? 'mobile-app');

        return $this->respond([
            'success' => true,
            'message' => 'Login successful',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    /**
     * POST /api/forgot-password
     */
    public function forgotPassword()
    {
        // Mocking for now as CI4 needs local email config
        return $this->respond([
            'success' => true,
            'message' => 'Si un compte existe pour cet email, vous recevrez les instructions sous peu.',
        ]);
    }
}
