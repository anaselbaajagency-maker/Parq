<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\TopUpRequestModel;
use CodeIgniter\API\ResponseTrait;

class PaymentController extends BaseController
{
    use ResponseTrait;

    public function callbackSuccess($method)
    {
        return $this->respond([
            'success' => true,
            'message' => 'Paiement réussi! Votre portefeuille a été crédité.',
        ]);
    }

    public function callbackFail($method)
    {
        return $this->respond([
            'success' => false,
            'message' => 'Le paiement a échoué. Veuillez réessayer.',
        ], 400);
    }

    public function webhook($method)
    {
        // Validation logic for gateways
        return $this->respond(['success' => true]);
    }

    public function status($reference)
    {
        $userId = $this->request->userId;
        $topUpModel = new TopUpRequestModel();
        $request = $topUpModel->where('user_id', $userId)
                              ->where('payment_reference', $reference)
                              ->first();

        if (!$request) return $this->failNotFound('Paiement non trouvé.');

        return $this->respond(['success' => true, 'data' => $request]);
    }
}
