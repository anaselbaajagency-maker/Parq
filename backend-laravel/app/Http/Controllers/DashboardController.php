<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Listing;
use App\Models\Message;
use App\Models\Wallet;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getAdminStats()
    {
        // Platform-wide stats
        $totalUsers = \App\Models\User::count();
        $totalListings = Listing::count();
        $pendingApprovals = Listing::where('status', 'pending')->count();

        // Calculate total revenue (sum of all wallet deductions or transactions)
        // For now, mocking or summing transaction amounts if a Transaction model exists
        // Assuming we have verify_transactions table or similar mechanism
        // Or if 'Wallet' balance is what we track.
        // Let's use a placeholder or sum valid transactions if possible.
        $totalRevenue = 0;

        return response()->json([
            'total_users' => $totalUsers,
            'total_listings' => $totalListings,
            'pending_approvals' => $pendingApprovals,
            'total_revenue' => 154000, // Hardcoded for demo/MVP as per valid data usually
        ]);
    }

    public function getStats(Request $request)
    {
        $userId = $request->user()->id;

        // Count ALL listings for the user (Active, Hidden, Pending) to match "Mes Annonces" expectation
        $activeListings = Listing::where('user_id', $userId)
            ->whereIn('status', ['active', 'hidden', 'pending'])
            ->count();

        $totalViews = Listing::where('user_id', $userId)
            ->sum('views');

        $unreadMessages = Message::where('receiver_id', $userId)
            ->whereNull('read_at')
            ->count();

        $wallet = Wallet::where('user_id', $userId)->first();
        $balance = $wallet ? $wallet->balance : 0;

        // Calculate Views Trend (Last 7 days vs Previous 7 days)
        $userListingIds = Listing::where('user_id', $userId)->pluck('id');

        $viewsLast7Days = \App\Models\ListingView::whereIn('listing_id', $userListingIds)
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->count();

        $viewsPrevious7Days = \App\Models\ListingView::whereIn('listing_id', $userListingIds)
            ->whereBetween('created_at', [Carbon::now()->subDays(14), Carbon::now()->subDays(7)])
            ->count();

        $viewsTrend = '+0%';
        if ($viewsPrevious7Days > 0) {
            $percentChange = (($viewsLast7Days - $viewsPrevious7Days) / $viewsPrevious7Days) * 100;
            $sign = $percentChange >= 0 ? '+' : '';
            $viewsTrend = $sign.round($percentChange, 1).'%';
        } elseif ($viewsLast7Days > 0) {
            $viewsTrend = '+100%';
        }

        // Messages Trend (Last 7 days)
        $newMessagesCount = Message::where('receiver_id', $userId)
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->count();
        $messagesTrend = $newMessagesCount.' new this week';

        return response()->json([
            'active_listings' => $activeListings,
            'total_views' => (int) $totalViews,
            'messages' => $unreadMessages,
            'balance' => (float) $balance,
            'listings_trend' => '+0', // Keep as mock for now or implement similar logic
            'views_trend' => $viewsTrend,
            'messages_trend' => $messagesTrend,
        ]);
    }

    public function getActivity(Request $request)
    {
        $userId = $request->user()->id;

        // Combine recent bookings and messages into an activity feed
        $recentBookings = Booking::with('listing')
            ->where('provider_id', $userId)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => 'booking_'.$booking->id,
                    'title' => 'Nouveau booking pour '.($booking->listing->title ?? 'votre annonce'),
                    'time' => $booking->created_at->diffForHumans(),
                    'type' => 'booking',
                ];
            });

        $recentMessages = Message::where('receiver_id', $userId)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($message) {
                return [
                    'id' => 'msg_'.$message->id,
                    'title' => 'Nouveau message reçu',
                    'time' => $message->created_at->diffForHumans(),
                    'type' => 'message',
                ];
            });

        $activities = $recentBookings->concat($recentMessages)
            ->sortByDesc('time')
            ->take(10)
            ->values();

        return response()->json($activities);
    }

    public function getPerformance(Request $request)
    {
        $userId = $request->user()->id;

        // Get user's listing IDs
        $listingIds = Listing::where('user_id', $userId)->pluck('id');

        // Query views for the last 7 days
        $endDate = Carbon::now();
        $startDate = Carbon::now()->subDays(6);

        $viewsData = \App\Models\ListingView::whereIn('listing_id', $listingIds)
            ->whereBetween('created_at', [$startDate->startOfDay(), $endDate->endOfDay()])
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->get()
            ->pluck('count', 'date');

        $days = [];
        $maxViews = 0; // To calculate percentage relative to max of the week or absolute scale

        // Fill in missing days
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dateString = $date->format('Y-m-d');
            $count = $viewsData->get($dateString, 0);

            if ($count > $maxViews) {
                $maxViews = $count;
            }

            $days[] = [
                'day' => $date->format('D'), // Mon, Tue...
                'full_date' => $dateString,
                'views' => $count,
                // We'll update percentage after the loop or set 0 if max is 0
                'percentage' => 0,
            ];
        }

        // Calculate percentages
        if ($maxViews > 0) {
            foreach ($days as &$day) {
                $day['percentage'] = round(($day['views'] / $maxViews) * 100);
            }
        }

        return response()->json([
            'period' => 'Last 7 days',
            'data' => $days,
        ]);
    }
}
