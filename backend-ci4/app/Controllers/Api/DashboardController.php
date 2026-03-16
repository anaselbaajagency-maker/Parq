<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\ListingModel;
use App\Models\MessageModel;
use App\Models\WalletModel;
use CodeIgniter\API\ResponseTrait;

class DashboardController extends BaseController
{
    use ResponseTrait;

    public function getStats()
    {
        $userId = $this->request->userId;
        $listingModel = new ListingModel();
        $messageModel = new MessageModel();
        $walletModel  = new WalletModel();

        $activeListings = $listingModel->where('user_id', $userId)
                                       ->whereIn('status', ['active', 'hidden', 'pending'])
                                       ->countAllResults();

        $totalViews = $listingModel->where('user_id', $userId)->selectSum('views')->first()['views'] ?? 0;
        
        $unreadMessages = $messageModel->where('receiver_id', $userId)
                                       ->where('read_at', null)
                                       ->countAllResults();

        $wallet = $walletModel->where('user_id', $userId)->first();
        $balance = $wallet ? $wallet['balance'] : 0;

        return $this->respond([
            'active_listings' => $activeListings,
            'total_views'     => (int) $totalViews,
            'messages'        => $unreadMessages,
            'balance'         => (float) $balance,
            'listings_trend'  => '+0',
            'views_trend'     => '+0%',
            'messages_trend'  => '0 new this week',
        ]);
    }

    public function getAdminStats()
    {
        $userModel = new \App\Models\UserModel();
        $listingModel = new ListingModel();

        return $this->respond([
            'total_users'       => $userModel->countAllResults(),
            'total_listings'    => $listingModel->countAllResults(),
            'pending_approvals' => $listingModel->where('status', 'pending')->countAllResults(),
            'total_revenue'     => 154000,
        ]);
    }

    public function getActivity()
    {
        // Mocking for now to match Laravel's logic
        return $this->respond([]);
    }

    public function getPerformance()
    {
        // Mocking for now to match Laravel's logic
        return $this->respond(['period' => 'Last 7 days', 'data' => []]);
    }
}
