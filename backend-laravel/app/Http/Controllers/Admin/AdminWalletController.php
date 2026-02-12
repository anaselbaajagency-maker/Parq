<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\TopUpApprovedNotification;
use App\Services\TopUpService;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminWalletController extends Controller
{
    public function __construct(
        protected WalletService $walletService,
        protected TopUpService $topUpService
    ) {}

    /**
     * Get all top-up requests with optional filters.
     *
     * GET /api/admin/topups
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'method', 'user_id', 'from_date', 'to_date']);
        $requests = $this->topUpService->getAllRequests($filters);

        return response()->json([
            'success' => true,
            'data' => $requests->map(function ($req) {
                return $this->formatTopUpRequest($req);
            }),
        ]);
    }

    /**
     * Get pending top-up requests.
     *
     * GET /api/admin/topups/pending
     */
    public function pending(): JsonResponse
    {
        $requests = $this->topUpService->getPendingRequests();

        return response()->json([
            'success' => true,
            'data' => $requests->map(function ($req) {
                return $this->formatTopUpRequest($req);
            }),
        ]);
    }

    /**
     * Get a single top-up request.
     *
     * GET /api/admin/topups/{id}
     */
    public function show(int $id): JsonResponse
    {
        $request = \App\Models\TopUpRequest::with(['user', 'approver'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $this->formatTopUpRequest($request, true),
        ]);
    }

    /**
     * Approve a top-up request.
     *
     * POST /api/admin/topups/{id}/approve
     */
    public function approve(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'notes' => 'nullable|string|max:500',
        ]);

        $admin = $request->user();
        $topUpRequest = \App\Models\TopUpRequest::findOrFail($id);

        try {
            $approved = $this->topUpService->approve(
                $topUpRequest,
                $admin,
                $request->input('notes')
            );

            // Notify the user
            $approved->user->notify(new TopUpApprovedNotification($approved));

            return response()->json([
                'success' => true,
                'message' => 'Demande approuvée avec succès',
                'data' => [
                    'request_id' => $approved->id,
                    'amount' => $approved->amount,
                    'user_new_balance' => $this->walletService->getBalance($approved->user),
                ],
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'success' => false,
                'error' => 'invalid_request',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Reject a top-up request.
     *
     * POST /api/admin/topups/{id}/reject
     */
    public function reject(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'reason' => 'required|string|min:10|max:500',
        ]);

        $admin = $request->user();
        $topUpRequest = \App\Models\TopUpRequest::findOrFail($id);

        try {
            $rejected = $this->topUpService->reject(
                $topUpRequest,
                $admin,
                $request->input('reason')
            );

            return response()->json([
                'success' => true,
                'message' => 'Demande rejetée',
                'data' => [
                    'request_id' => $rejected->id,
                ],
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'success' => false,
                'error' => 'invalid_request',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Manual admin credit to user wallet.
     *
     * POST /api/admin/wallets/{userId}/credit
     */
    public function manualCredit(Request $request, int $userId): JsonResponse
    {
        $request->validate([
            'amount' => 'required|integer|min:1|max:100000',
            'description' => 'required|string|min:5|max:255',
        ]);

        $admin = $request->user();
        $user = User::findOrFail($userId);

        $transaction = $this->walletService->adminCredit(
            $user,
            $request->input('amount'),
            $request->input('description'),
            $admin
        );

        return response()->json([
            'success' => true,
            'message' => 'Crédit ajouté avec succès',
            'data' => [
                'transaction_id' => $transaction->id,
                'amount' => $transaction->amount,
                'user_new_balance' => $this->walletService->getBalance($user),
            ],
        ]);
    }

    /**
     * Get user wallet info (for admin).
     *
     * GET /api/admin/wallets/{userId}
     */
    public function userWallet(int $userId): JsonResponse
    {
        $user = User::with('wallet')->findOrFail($userId);
        $wallet = $this->walletService->getOrCreateWallet($user);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'full_name' => $user->full_name,
                    'email' => $user->email,
                ],
                'wallet' => [
                    'balance' => $wallet->balance,
                    'formatted_balance' => $wallet->formatted_balance,
                    'total_credits' => $this->walletService->getTotalCredits($user),
                    'total_spent' => $this->walletService->getTotalDebits($user),
                ],
                'recent_transactions' => $this->walletService->getTransactionHistory($user, 10)->map(function ($tx) {
                    return [
                        'id' => $tx->id,
                        'amount' => $tx->amount,
                        'type' => $tx->type,
                        'type_label' => $tx->type_label,
                        'description' => $tx->description,
                        'created_at' => $tx->created_at->toIso8601String(),
                    ];
                }),
            ],
        ]);
    }

    /**
     * Get top-up statistics.
     *
     * GET /api/admin/topups/stats
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->topUpService->getStatistics(),
        ]);
    }

    /**
     * Format a top-up request for JSON response.
     */
    protected function formatTopUpRequest($request, bool $detailed = false): array
    {
        $data = [
            'id' => $request->id,
            'user' => [
                'id' => $request->user->id,
                'full_name' => $request->user->full_name,
                'email' => $request->user->email,
                'avatar' => $request->user->avatar,
            ],
            'amount' => $request->amount,
            'method' => $request->method,
            'method_label' => $request->method_label,
            'status' => $request->status,
            'status_label' => $request->status_label,
            'status_color' => $request->status_color,
            'reference' => $request->payment_reference,
            'proof_image' => $request->proof_image ? asset('storage/'.$request->proof_image) : null,
            'created_at' => $request->created_at->toIso8601String(),
        ];

        if ($detailed) {
            $data['admin_notes'] = $request->admin_notes;
            $data['approved_at'] = $request->approved_at?->toIso8601String();
            $data['approver'] = $request->approver ? [
                'id' => $request->approver->id,
                'full_name' => $request->approver->full_name,
            ] : null;
            $data['metadata'] = $request->metadata;
        }

        return $data;
    }
}
