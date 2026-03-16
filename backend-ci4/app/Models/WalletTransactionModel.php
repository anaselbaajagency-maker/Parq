<?php

namespace App\Models;

use CodeIgniter\Model;

class WalletTransactionModel extends Model
{
    protected $table = 'wallet_transactions';
    protected $primaryKey = 'id';
    protected $allowedFields = ['wallet_id', 'type', 'amount', 'description', 'reference_id', 'reference_type', 'metadata'];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $afterFind = ['decodeMetadata'];

    protected function decodeMetadata(array $data)
    {
        if (isset($data['data'])) {
            $item = &$data['data'];
            if (isset($item['metadata']) && is_string($item['metadata'])) {
                $item['metadata'] = json_decode($item['metadata'], true);
            }
        } else {
            foreach ($data as &$item) {
                if (isset($item['metadata']) && is_string($item['metadata'])) {
                    $item['metadata'] = json_decode($item['metadata'], true);
                }
            }
        }
        return $data;
    }
}
