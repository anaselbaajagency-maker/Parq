<?php

namespace App\Services;

use App\Models\ListingModel;

class ListingService
{
    protected $listingModel;

    public function __construct()
    {
        $this->listingModel = new \App\Models\ListingModel();
    }

    public function approve(int $listingId)
    {
        return $this->listingModel->update($listingId, [
            'status'       => 'active',
            'published_at' => date('Y-m-d H:i:s')
        ]);
    }

    public function reject(int $listingId, string $reason = null)
    {
        return $this->listingModel->update($listingId, [
            'status' => 'rejected'
            // Add reason to metadata if needed
        ]);
    }
}
