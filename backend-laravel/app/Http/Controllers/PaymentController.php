<?php

namespace App\Http\Controllers;

use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService
    ) {}

    /**
     * Handle payment success callback (redirect from gateway).
     * 
     * GET /api/payments/callback/{method}/success
     */
    public function callbackSuccess(Request $request, string $method): JsonResponse
    {
        Log::info("Payment callback success received for {$method}", $request->all());

        try {
            $topUpRequest = $this->paymentService->handleCallback($method, $request->all());

            if ($topUpRequest->isApproved()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Paiement réussi! Votre portefeuille a été crédité.',
                    'data' => [
                        'amount' => $topUpRequest->amount,
                        'reference' => $topUpRequest->payment_reference,
                    ],
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Le paiement n\'a pas pu être validé.',
            ], 400);

        } catch (\Exception $e) {
            Log::error("Payment callback error: " . $e->getMessage(), [
                'method' => $method,
                'data' => $request->all(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du traitement du paiement.',
            ], 500);
        }
    }

    /**
     * Handle payment failure callback.
     * 
     * GET /api/payments/callback/{method}/fail
     */
    public function callbackFail(Request $request, string $method): JsonResponse
    {
        Log::warning("Payment callback failure received for {$method}", $request->all());

        return response()->json([
            'success' => false,
            'message' => 'Le paiement a échoué. Veuillez réessayer.',
            'data' => [
                'error_code' => $request->input('ErrCode', $request->input('error_code')),
                'error_message' => $request->input('ErrMsg', $request->input('error_message')),
            ],
        ], 400);
    }

    /**
     * Handle payment gateway webhook.
     * 
     * POST /api/payments/webhook/{method}
     */
    public function webhook(Request $request, string $method): JsonResponse
    {
        Log::info("Payment webhook received for {$method}", [
            'headers' => $request->headers->all(),
            'body' => $request->all(),
        ]);

        // Validate webhook signature
        $signature = $request->header('X-Signature', $request->input('hash', ''));

        if (!$this->paymentService->validateWebhook($method, $request->all(), $signature)) {
            Log::warning("Invalid webhook signature for {$method}");
            return response()->json(['error' => 'Invalid signature'], 401);
        }

        try {
            $topUpRequest = $this->paymentService->handleCallback($method, $request->all());

            Log::info("Webhook processed successfully", [
                'request_id' => $topUpRequest->id,
                'status' => $topUpRequest->status,
            ]);

            return response()->json(['success' => true]);

        } catch (\Exception $e) {
            Log::error("Webhook processing error: " . $e->getMessage(), [
                'method' => $method,
                'exception' => $e,
            ]);

            return response()->json(['error' => 'Processing failed'], 500);
        }
    }

    /**
     * Check payment status.
     * 
     * GET /api/payments/status/{reference}
     */
    public function status(Request $request, string $reference): JsonResponse
    {
        $user = $request->user();

        $topUpRequest = $user->topUpRequests()
            ->where('payment_reference', $reference)
            ->first();

        if (!$topUpRequest) {
            return response()->json([
                'success' => false,
                'error' => 'not_found',
                'message' => 'Paiement non trouvé.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'reference' => $topUpRequest->payment_reference,
                'amount' => $topUpRequest->amount,
                'method' => $topUpRequest->method,
                'status' => $topUpRequest->status,
                'status_label' => $topUpRequest->status_label,
                'created_at' => $topUpRequest->created_at->toIso8601String(),
                'approved_at' => $topUpRequest->approved_at?->toIso8601String(),
            ],
        ]);
    }
}
