<?php

namespace App\Http\Controllers;

use App\Http\Requests\Wallet\WalletRedeemCouponRequest;
use App\Http\Requests\Wallet\WalletTopupRequest;
use App\Http\Requests\Wallet\WalletTransactionsRequest;
use App\Http\Requests\Wallet\WalletUploadProofRequest;
use App\Http\Resources\TopUpRequestResource;
use App\Http\Resources\WalletTransactionResource;
use App\Services\AuditLogService;
use App\Services\PaymentService;
use App\Services\TopUpService;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function __construct(
        protected WalletService $walletService,
        protected TopUpService $topUpService,
        protected PaymentService $paymentService,
        protected AuditLogService $auditLogService
    ) {}

    /**
     * Get current wallet balance.
     *
     * GET /api/wallet/balance
     */
    public function balance(Request $request): JsonResponse
    {
        $user = $request->user();
        $wallet = $this->walletService->getOrCreateWallet($user);

        return response()->json([
            'success' => true,
            'data' => [
                'balance' => $wallet->balance,
                'currency_label' => $wallet->currency_label,
                'formatted_balance' => $wallet->formatted_balance,
                'balance_in_mad' => $wallet->balance_in_mad,
                'daily_expense' => $dailyExpense = $this->walletService->getDailyExpense($user),
                'days_remaining' => $daysRemaining = $this->walletService->getDaysRemaining($user),
                'low_balance_warning' => $daysRemaining <= 7 && $dailyExpense > 0,
                'critical_balance_warning' => $daysRemaining <= 3 && $dailyExpense > 0,
                'has_paused_listings' => $user->listings()->where('status', 'paused')->exists(),
            ],
        ]);
    }

    /**
     * Get transaction history.
     *
     * GET /api/wallet/transactions
     */
    public function transactions(WalletTransactionsRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = $request->user();
        $limit = (int) ($validated['limit'] ?? 20);
        $offset = (int) ($validated['offset'] ?? 0);
        $type = $validated['type'] ?? null;

        if ($type) {
            $transactions = $this->walletService->getTransactionsByType($user, $type, $limit);
        } else {
            $transactions = $this->walletService->getTransactionHistory($user, $limit, $offset);
        }
        $transactions->loadMissing('reference');

        return response()->json([
            'success' => true,
            'data' => WalletTransactionResource::collection($transactions)->resolve(),
        ]);
    }

    /**
     * Get available payment methods.
     *
     * GET /api/wallet/payment-methods
     */
    public function paymentMethods(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->paymentService->getAvailableMethods(),
        ]);
    }

    /**
     * Initiate a top-up.
     *
     * POST /api/wallet/topup
     */
    public function topup(WalletTopupRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = $request->user();
        $amount = (int) $validated['amount'];
        $method = (string) $validated['method'];

        try {
            // For bank transfer with proof image, use TopUpService
            if ($method === 'bank_transfer') {
                $topUpRequest = $this->topUpService->createManualRequest(
                    $user,
                    $amount,
                    $request->file('proof_image')
                );

                $this->auditLogService->log(
                    'wallet.topup.manual_request_created',
                    $user,
                    'topup_request',
                    $topUpRequest->id,
                    [
                        'amount' => $amount,
                        'method' => $method,
                    ]
                );

                \Illuminate\Support\Facades\Log::info('Top-up request created', ['id' => $topUpRequest->id, 'user_id' => $user->id]);

                return response()->json([
                    'success' => true,
                    'message' => 'Demande de recharge créée avec succès',
                    'data' => (new TopUpRequestResource($topUpRequest))->resolve(),
                ], 201);
            }

            // For online payments, use PaymentService
            $result = $this->paymentService->initiatePayment($user, $amount, $method);

            $this->auditLogService->log(
                'wallet.topup.payment_initiated',
                $user,
                'wallet',
                $user->id,
                [
                    'amount' => $amount,
                    'method' => $method,
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Paiement initié',
                'data' => $result,
            ]);

        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'error' => 'validation_error',
                'message' => $e->getMessage(),
            ], 422);
        } catch (\RuntimeException $e) {
            return response()->json([
                'success' => false,
                'error' => 'service_unavailable',
                'message' => $e->getMessage(),
            ], 503);
        }
    }

    /**
     * Upload proof for a pending top-up request.
     *
     * POST /api/wallet/topup/{id}/proof
     */
    public function uploadProof(WalletUploadProofRequest $request, int $id): JsonResponse
    {
        \Illuminate\Support\Facades\Log::info('Upload proof attempt', ['id' => $id, 'user_id' => $request->user()->id]);
        $user = $request->user();
        $topUpRequest = $user->topUpRequests()->findOrFail($id);

        try {
            $updated = $this->topUpService->uploadProof(
                $topUpRequest,
                $request->file('proof_image')
            );

            $this->auditLogService->log(
                'wallet.topup.proof_uploaded',
                $user,
                'topup_request',
                $updated->id
            );

            return response()->json([
                'success' => true,
                'message' => 'Justificatif téléchargé avec succès',
                'data' => [
                    'id' => $updated->id,
                    'proof_image' => $updated->proof_image_url,
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
     * Get user's top-up requests.
     *
     * GET /api/wallet/topup-requests
     */
    public function topupRequests(Request $request): JsonResponse
    {
        $user = $request->user();
        $requests = $this->topUpService->getUserRequests($user)->loadMissing('user', 'approver');

        return response()->json([
            'success' => true,
            'data' => TopUpRequestResource::collection($requests)->resolve(),
        ]);
    }

    /**
     * Cancel a pending top-up request.
     *
     * DELETE /api/wallet/topup-requests/{id}
     */
    public function cancelTopupRequest(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $topUpRequest = $user->topUpRequests()->findOrFail($id);

        try {
            $this->topUpService->cancel($topUpRequest, $user);

            $this->auditLogService->log(
                'wallet.topup.request_cancelled',
                $user,
                'topup_request',
                $topUpRequest->id
            );

            return response()->json([
                'success' => true,
                'message' => 'Demande annulée avec succès',
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
     * Redeem a coupon code.
     *
     * POST /api/wallet/redeem-coupon
     */
    public function redeemCoupon(WalletRedeemCouponRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = $request->user();

        try {
            $transaction = $this->walletService->redeemCoupon($user, $validated['code']);

            $this->auditLogService->log(
                'wallet.coupon.redeemed',
                $user,
                'wallet_transaction',
                $transaction->id,
                [
                    'code' => $validated['code'],
                    'amount' => $transaction->amount,
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Coupon utilisé avec succès!',
                'data' => [
                    'credited_amount' => $transaction->amount,
                    'new_balance' => $this->walletService->getBalance($user),
                ],
            ]);
        } catch (\App\Exceptions\InvalidCouponException $e) {
            return response()->json([
                'success' => false,
                'error' => 'invalid_coupon',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get wallet summary (for dashboard).
     *
     * GET /api/wallet/summary
     */
    public function summary(Request $request): JsonResponse
    {
        $user = $request->user();
        $wallet = $this->walletService->getOrCreateWallet($user);
        $recentTransactions = $this->walletService->getTransactionHistory($user, 5)->loadMissing('reference');

        return response()->json([
            'success' => true,
            'data' => [
                'balance' => $wallet->balance,
                'formatted_balance' => $wallet->formatted_balance,
                'total_credits' => $this->walletService->getTotalCredits($user),
                'total_spent' => $this->walletService->getTotalDebits($user),
                'recent_transactions' => WalletTransactionResource::collection($recentTransactions)->resolve(),
            ],
        ]);
    }
}
