<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\UserModel;
use CodeIgniter\API\ResponseTrait;

class AdminUserController extends BaseController
{
    use ResponseTrait;

    protected $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    public function index()
    {
        $users = $this->userModel->orderBy('created_at', 'desc')->findAll();
        return $this->respond($users);
    }

    public function show($id = null)
    {
        $user = $this->userModel->find($id);
        return $user ? $this->respond($user) : $this->failNotFound();
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        $this->userModel->update($id, $data);
        return $this->respond($this->userModel->find($id));
    }

    public function delete($id = null)
    {
        $this->userModel->delete($id);
        return $this->respondNoContent();
    }
}
