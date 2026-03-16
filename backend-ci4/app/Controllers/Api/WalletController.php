<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\WalletModel;
use App\Models\WalletTransactionModel;
use App\Models\TopUpRequestModel;
use App\Models\PaymentMethodModel;
use CodeIgniter\API\ResponseTrait;

class WalletController extends BaseController
{
    use ResponseTrait;

    protected $walletModel;

    public function __construct()
    {
        $this->walletModel = new WalletModel();
    }

    public function balance()
    {
        $userId = $this->request->userId;
        $wallet = $this->walletModel->where('user_id', $userId)->first();
        if (!$wallet) {
            $this->walletModel->insert(['user_id' => $userId, 'balance' => 0]);
            $wallet = $this->walletModel->where('user_id', $userId)->first();
        }

        return $this->respond([
            'success' => true,
            'data' => [
                'balance'           => (float) $wallet['balance'],
                'currency_label'    => 'MAD',
                'formatted_balance' => number_format($wallet['balance'], 2) . ' MAD',
                'daily_expense'     => 0,
                'days_remaining'    => 0,
            ]
        ]);
    }

    public function transactions()
    {
        $userId = $this->request->userId;
        $wallet = $this->walletModel->where('user_id', $userId)->first();
        if (!$wallet) return $this->respond(['success' => true, 'data' => []]);

        $transactionModel = new WalletTransactionModel();
        $transactions = $transactionModel->where('wallet_id', $wallet['id'])
                                         ->orderBy('created_at', 'desc')
                                         ->findAll();

        return $this->respond(['success' => true, 'data' => $transactions]);
    }

    public function paymentMethods()
    {
        $pm = new PaymentMethodModel();
        return $this->respond(['success' => true, 'data' => $pm->where('is_active', true)->findAll()]);
    }

    public function summary()
    {
        $userId = $this->request->userId;
        $wallet = $this->walletModel->where('user_id', $userId)->first();
        return $this->respond([
            'success' => true,
            'data' => [
                'balance' => $wallet ? $wallet['balance'] : 0,
                'total_credits' => 0,
                'total_spent' => 0,
                'recent_transactions' => []
            ]
        ]);
    }
}
