<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserModel;
use CodeIgniter\API\ResponseTrait;

class AccountController extends BaseController
{
    use ResponseTrait;

    public function destroy()
    {
        $userId = $this->request->userId;
        $userModel = new UserModel();
        $userModel->delete($userId);

        return $this->respond(['message' => 'Account deleted successfully']);
    }
}
