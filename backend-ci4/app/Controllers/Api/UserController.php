<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserModel;
use App\Models\ListingModel;
use CodeIgniter\API\ResponseTrait;

class UserController extends BaseController
{
    use ResponseTrait;

    public function getProfile($userId)
    {
        $userModel = new UserModel();
        $listingModel = new ListingModel();

        $user = $userModel->select('id, full_name, avatar, created_at, role, phone')
                          ->find($userId);

        if (!$user) return $this->failNotFound('User not found');

        $listings = $listingModel->where('user_id', $userId)
                                 ->where('status', 'active')
                                 ->orderBy('created_at', 'desc')
                                 ->findAll();

        return $this->respond([
            'user' => $user,
            'listings' => $listings,
        ]);
    }
}
