<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminTopupApproveRequest;
use App\Http\Requests\Admin\AdminTopupFiltersRequest;
use App\Http\Requests\Admin\AdminTopupRejectRequest;
use App\Http\Requests\Admin\AdminWalletManualCreditRequest;
use App\Http\Resources\TopUpRequestResource;
use App\Http\Resources\WalletTransactionResource;
use App\Models\TopUpRequest;
use App\Models\User;
use App\Notifications\TopUpApprovedNotification;
use App\Services\AuditLogService;
use App\Services\TopUpService;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;

class AdminWalletController extends Controller
{
    public function __construct(
        protected WalletService $walletService,
        protected TopUpService $topUpService,
        protected AuditLogService $auditLogService
    ) {}

    /**
     * Get all top-up requests with optional filters.
     *
     * GET /api/admin/topups
     */
    public function index(AdminTopupFiltersRequest $request): JsonResponse
    {
        $filters = $request->validated();
        $requests = $this->topUpService->getAllRequests($filters);
        $requests->loadMissing('user', 'approver');

        return response()->json([
            'success' => true,
            'data' => TopUpRequestResource::collection($requests)->resolve(),
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
        $requests->loadMissing('user', 'approver');

        return response()->json([
            'success' => true,
            'data' => TopUpRequestResource::collection($requests)->resolve(),
        ]);
    }

    /**
     * Get a single top-up request.
     *
     * GET /api/admin/topups/{id}
     */
    public function show(int $id): JsonResponse
    {
        $request = TopUpRequest::with(['user', 'approver'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => (new TopUpRequestResource($request))->resolve(),
        ]);
    }

    /**
     * Approve a top-up request.
     *
     * POST /api/admin/topups/{id}/approve
     */
    public function approve(AdminTopupApproveRequest $request, int $id): JsonResponse
    {
        $validated = $request->validated();

        $admin = $request->user();
        $topUpRequest = TopUpRequest::findOrFail($id);

        try {
            $approved = $this->topUpService->approve(
                $topUpRequest,
                $admin,
                $validated['notes'] ?? null
            );

            $this->auditLogService->log(
                'admin.topup.approved',
                $admin,
                'topup_request',
                $approved->id,
                [
                    'amount' => $approved->amount,
                    'notes' => $validated['notes'] ?? null,
                ]
            );

            // Notify the user
            $approved->user->notify(new TopUpApprovedNotification($approved));

            return response()->json([
                'success' => true,
                'message' => 'Demande approuvée avec succès',
                'data' => [
                    'id' => $approved->id,
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
    public function reject(AdminTopupRejectRequest $request, int $id): JsonResponse
    {
        $validated = $request->validated();

        $admin = $request->user();
        $topUpRequest = TopUpRequest::findOrFail($id);

        try {
            $rejected = $this->topUpService->reject(
                $topUpRequest,
                $admin,
                $validated['reason']
            );

            $this->auditLogService->log(
                'admin.topup.rejected',
                $admin,
                'topup_request',
                $rejected->id,
                [
                    'reason' => $validated['reason'],
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Demande rejetée',
                'data' => [
                    'id' => $rejected->id,
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
    public function manualCredit(AdminWalletManualCreditRequest $request, int $userId): JsonResponse
    {
        $validated = $request->validated();

        $admin = $request->user();
        $user = User::findOrFail($userId);

        $transaction = $this->walletService->adminCredit(
            $user,
            $validated['amount'],
            $validated['description'],
            $admin
        );

        $this->auditLogService->log(
            'admin.wallet.manual_credit',
            $admin,
            'wallet_transaction',
            $transaction->id,
            [
                'beneficiary_user_id' => $user->id,
                'amount' => $validated['amount'],
            ]
        );

        // Notify the user
        $user->notify(new \App\Notifications\AdminWalletUpdateNotification(
            $validated['amount'], 
            'credit', 
            $validated['description'] ?? 'Crédit manuel par l\'administrateur'
        ));

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
        $recentTransactions = $this->walletService->getTransactionHistory($user, 10)->loadMissing('reference');

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
                'recent_transactions' => WalletTransactionResource::collection($recentTransactions)->resolve(),
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
}
