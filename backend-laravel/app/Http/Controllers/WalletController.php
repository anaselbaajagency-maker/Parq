<?php

namespace App\Http\Controllers;

use App\Services\PaymentService;
use App\Services\TopUpService;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class WalletController extends Controller
{
    public function __construct(
        protected WalletService $walletService,
        protected TopUpService $topUpService,
        protected PaymentService $paymentService
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
            ],
        ]);
    }

    /**
     * Get transaction history.
     *
     * GET /api/wallet/transactions
     */
    public function transactions(Request $request): JsonResponse
    {
        $request->validate([
            'limit' => 'integer|min:1|max:100',
            'offset' => 'integer|min:0',
            'type' => ['string', Rule::in(['bonus', 'topup_manual', 'online_payment', 'deduction', 'coupon', 'admin_credit', 'credit', 'debit'])],
        ]);

        $user = $request->user();
        $limit = $request->input('limit', 20);
        $offset = $request->input('offset', 0);
        $type = $request->input('type');

        if ($type) {
            $transactions = $this->walletService->getTransactionsByType($user, $type, $limit);
        } else {
            $transactions = $this->walletService->getTransactionHistory($user, $limit, $offset);
        }

        return response()->json([
            'success' => true,
            'data' => $transactions->map(function ($tx) {
                $receiptUrl = null;
                if ($tx->reference_type === 'App\Models\TopUpRequest' && $tx->reference && $tx->reference->proof_image) {
                    $receiptUrl = asset('storage/'.$tx->reference->proof_image);
                }

                return [
                    'id' => $tx->id,
                    'amount' => $tx->amount,
                    'formatted_amount' => $tx->formatted_amount,
                    'type' => $tx->type,
                    'type_label' => $tx->type_label,
                    'source' => $tx->source,
                    'source_label' => $tx->source_label,
                    'description' => $tx->description,
                    'status' => 'completed',
                    'created_at' => $tx->created_at->toIso8601String(),
                    'receipt_url' => $receiptUrl,
                ];
            }),
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
    public function topup(Request $request): JsonResponse
    {
        $request->validate([
            'amount' => 'required|integer|min:'.config('wallet.minimum_topup', 50).'|max:'.config('wallet.maximum_topup', 10000),
            'method' => ['required', 'string', Rule::in(['bank_transfer', 'cmi', 'payzone', 'cashplus'])],
            'proof_image' => 'nullable|image|max:5120', // 5MB max
        ]);

        $user = $request->user();
        $amount = $request->input('amount');
        $method = $request->input('method');

        try {
            // For bank transfer with proof image, use TopUpService
            if ($method === 'bank_transfer') {
                $topUpRequest = $this->topUpService->createManualRequest(
                    $user,
                    $amount,
                    $request->file('proof_image')
                );

                return response()->json([
                    'success' => true,
                    'message' => 'Demande de recharge créée avec succès',
                    'data' => [
                        'request_id' => $topUpRequest->id,
                        'reference' => $topUpRequest->payment_reference,
                        'status' => $topUpRequest->status,
                        'bank_details' => [
                            'bank_name' => config('wallet.bank_transfer.bank_name'),
                            'account_name' => config('wallet.bank_transfer.account_name'),
                            'account_number' => config('wallet.bank_transfer.account_number'),
                            'rib' => config('wallet.bank_transfer.rib'),
                        ],
                    ],
                ], 201);
            }

            // For online payments, use PaymentService
            $result = $this->paymentService->initiatePayment($user, $amount, $method);

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
    public function uploadProof(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'proof_image' => 'required|image|max:5120',
        ]);

        $user = $request->user();
        $topUpRequest = $user->topUpRequests()->findOrFail($id);

        try {
            $updated = $this->topUpService->uploadProof(
                $topUpRequest,
                $request->file('proof_image')
            );

            return response()->json([
                'success' => true,
                'message' => 'Justificatif téléchargé avec succès',
                'data' => [
                    'request_id' => $updated->id,
                    'proof_image' => asset('storage/'.$updated->proof_image),
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
        $requests = $this->topUpService->getUserRequests($user);

        return response()->json([
            'success' => true,
            'data' => $requests->map(function ($req) {
                return [
                    'id' => $req->id,
                    'amount' => $req->amount,
                    'method' => $req->method,
                    'method_label' => $req->method_label,
                    'status' => $req->status,
                    'status_label' => $req->status_label,
                    'status_color' => $req->status_color,
                    'reference' => $req->payment_reference,
                    'proof_image' => $req->proof_image ? asset('storage/'.$req->proof_image) : null,
                    'admin_notes' => $req->admin_notes,
                    'created_at' => $req->created_at->toIso8601String(),
                    'approved_at' => $req->approved_at?->toIso8601String(),
                ];
            }),
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
    public function redeemCoupon(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string|min:3|max:50',
        ]);

        $user = $request->user();

        try {
            $transaction = $this->walletService->redeemCoupon($user, $request->input('code'));

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

        return response()->json([
            'success' => true,
            'data' => [
                'balance' => $wallet->balance,
                'formatted_balance' => $wallet->formatted_balance,
                'total_credits' => $this->walletService->getTotalCredits($user),
                'total_spent' => $this->walletService->getTotalDebits($user),
                'recent_transactions' => $this->walletService->getTransactionHistory($user, 5)->map(function ($tx) {
                    return [
                        'id' => $tx->id,
                        'amount' => $tx->amount,
                        'type' => $tx->type,
                        'description' => $tx->description,
                        'created_at' => $tx->created_at->toIso8601String(),
                    ];
                }),
            ],
        ]);
    }
}
