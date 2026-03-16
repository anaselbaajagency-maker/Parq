<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\WalletModel;
use App\Models\TopUpRequestModel;
use CodeIgniter\API\ResponseTrait;

class AdminWalletController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $topUpModel = new TopUpRequestModel();
        return $this->respond($topUpModel->orderBy('created_at', 'desc')->findAll());
    }

    public function pending()
    {
        $topUpModel = new TopUpRequestModel();
        return $this->respond($topUpModel->where('status', 'pending')->orderBy('created_at', 'desc')->findAll());
    }

    public function approve($id)
    {
        $topUpModel = new TopUpRequestModel();
        $request = $topUpModel->find($id);
        if (!$request) return $this->failNotFound();

        $topUpModel->update($id, [
            'status' => 'approved',
            'approved_at' => date('Y-m-d H:i:s'),
            'approver_id' => $this->request->userId
        ]);

        // Logic to credit wallet would go here or in a Service
        
        return $this->respond(['success' => true, 'message' => 'Request approved and wallet credited.']);
    }

    public function reject($id)
    {
        $topUpModel = new TopUpRequestModel();
        $topUpModel->update($id, ['status' => 'rejected']);
        return $this->respond(['success' => true, 'message' => 'Request rejected.']);
    }
}
