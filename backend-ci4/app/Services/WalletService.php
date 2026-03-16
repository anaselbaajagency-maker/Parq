<?php

namespace App\Services;

use App\Models\WalletModel;
use App\Models\WalletTransactionModel;

class WalletService
{
    protected $walletModel;
    protected $transactionModel;

    public function __construct()
    {
        $this->walletModel = new \App\Models\WalletModel();
        $this->transactionModel = new \App\Models\WalletTransactionModel();
    }

    public function credit(int $userId, float $amount, string $description, string $refType = null, int $refId = null)
    {
        $wallet = $this->walletModel->where('user_id', $userId)->first();
        if (!$wallet) {
            $walletId = $this->walletModel->insert(['user_id' => $userId, 'balance' => 0]);
            $wallet = $this->walletModel->find($walletId);
        }

        $newBalance = $wallet['balance'] + $amount;
        $this->walletModel->update($wallet['id'], ['balance' => $newBalance]);

        $this->transactionModel->insert([
            'wallet_id'      => $wallet['id'],
            'type'           => 'credit',
            'amount'         => $amount,
            'description'    => $description,
            'reference_type' => $refType,
            'reference_id'   => $refId,
        ]);

        return $newBalance;
    }
}
