<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\CouponModel;
use CodeIgniter\API\ResponseTrait;

class AdminCouponController extends BaseController
{
    use ResponseTrait;

    protected $couponModel;

    public function __construct()
    {
        $this->couponModel = new CouponModel();
    }

    public function index()
    {
        return $this->respond($this->couponModel->orderBy('created_at', 'desc')->findAll());
    }

    public function store()
    {
        $data = $this->request->getJSON(true);
        $id = $this->couponModel->insert($data);
        return $this->respondCreated($this->couponModel->find($id));
    }

    public function toggle($id)
    {
        $coupon = $this->couponModel->find($id);
        if (!$coupon) return $this->failNotFound();
        
        $this->couponModel->update($id, ['is_active' => !$coupon['is_active']]);
        return $this->respond(['success' => true]);
    }

    public function delete($id = null)
    {
        $this->couponModel->delete($id);
        return $this->respondNoContent();
    }
}
