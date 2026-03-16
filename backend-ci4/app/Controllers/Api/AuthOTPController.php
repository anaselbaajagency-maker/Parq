<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserModel;
use App\Models\OtpModel;
use App\Libraries\JWTAuth;
use CodeIgniter\API\ResponseTrait;

class AuthOTPController extends BaseController
{
    use ResponseTrait;

    protected $userModel;
    protected $otpModel;
    protected $jwt;

    public function __construct()
    {
        $this->userModel = new UserModel();
        $this->otpModel = new OtpModel();
        $this->jwt = new JWTAuth();
    }

    /**
     * POST /api/auth/otp/send
     */
    public function sendOTP()
    {
        $rules = [
            'phone' => 'required|min_length[10]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = $this->request->getJSON(true);
        $phone = $data['phone'];
        $code = (string) rand(100000, 999999);
        $expiresAt = date('Y-m-d H:i:s', strtotime('+10 minutes'));

        $this->otpModel->insert([
            'phone'      => $phone,
            'code'       => $code,
            'expires_at' => $expiresAt,
        ]);

        // Mocking sending SMS
        log_message('info', "OTP for {$phone}: {$code}");

        return $this->respond([
            'success'    => true,
            'message'    => 'OTP sent successfully (check logs)',
            'expires_at' => date('c', strtotime($expiresAt)),
        ]);
    }

    /**
     * POST /api/auth/otp/verify
     */
    public function verifyOTP()
    {
        $rules = [
            'phone' => 'required',
            'code'  => 'required',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = $this->request->getJSON(true);
        $otp = $this->otpModel->where('phone', $data['phone'])
                              ->where('code', $data['code'])
                              ->where('expires_at >', date('Y-m-d H:i:s'))
                              ->where('verified_at', null)
                              ->orderBy('created_at', 'desc')
                              ->first();

        if (!$otp) {
            return $this->failUnauthorized('Invalid or expired OTP');
        }

        $this->otpModel->update($otp['id'], ['verified_at' => date('Y-m-d H:i:s')]);

        $user = $this->userModel->where('phone', $data['phone'])->first();

        if (!$user) {
            $user = [
                'full_name' => 'User ' . substr($data['phone'], -4),
                'email'     => $data['phone'] . '@parq.ma',
                'phone'     => $data['phone'],
                'role'      => 'user',
                'password'  => null,
            ];
            $userId = $this->userModel->insert($user);
            $user = $this->userModel->find($userId);
        }

        unset($user['password']);
        $token = $this->jwt->generateToken((int)$user['id'], $data['device_name'] ?? 'mobile-app');

        return $this->respond([
            'success' => true,
            'message' => 'Authentication successful',
            'user'    => $user, // Use Resource translation later
            'token'   => $token,
        ]);
    }
}
