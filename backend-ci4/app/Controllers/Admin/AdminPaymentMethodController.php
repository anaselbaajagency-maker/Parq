<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\PaymentMethodModel;
use CodeIgniter\API\ResponseTrait;

class AdminPaymentMethodController extends BaseController
{
    use ResponseTrait;

    protected $pmModel;

    public function __construct()
    {
        $this->pmModel = new PaymentMethodModel();
    }

    public function index()
    {
        return $this->respond($this->pmModel->orderBy('order', 'asc')->findAll());
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        $this->pmModel->update($id, $data);
        return $this->respond($this->pmModel->find($id));
    }

    public function toggle($id)
    {
        $pm = $this->pmModel->find($id);
        if (!$pm) return $this->failNotFound();
        
        $this->pmModel->update($id, ['is_active' => !$pm['is_active']]);
        return $this->respond(['success' => true]);
    }
}
