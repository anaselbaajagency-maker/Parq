<?php

namespace App\Services;

use App\Models\TopUpRequestModel;

class TopUpService
{
    protected $topUpModel;

    public function __construct()
    {
        $this->topUpModel = new \App\Models\TopUpRequestModel();
    }

    public function createRequest(int $userId, float $amount, string $method, string $ref = null)
    {
        return $this->topUpModel->insert([
            'user_id'           => $userId,
            'amount'            => $amount,
            'method'            => $method,
            'status'            => 'pending',
            'payment_reference' => $ref,
        ]);
    }

    public function approve(int $requestId, int $approverId)
    {
        $request = $this->topUpModel->find($requestId);
        if (!$request || $request['status'] !== 'pending') return false;

        $walletService = new WalletService();
        $walletService->credit(
            $request['user_id'], 
            $request['amount'], 
            "Recharge de compte via {$request['method']}", 
            'top_up_requests', 
            $requestId
        );

        return $this->topUpModel->update($requestId, [
            'status'      => 'approved',
            'approved_at' => date('Y-m-d H:i:s'),
            'approver_id' => $approverId
        ]);
    }
}
