<?php

namespace App\Services;

use App\Models\User;
use App\Models\TopUpRequest;
use App\Models\PaymentMethod;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentService
{
    protected WalletService $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    /**
     * Get available payment methods for user.
     */
    public function getAvailableMethods(): array
    {
        return PaymentMethod::active()
            ->ordered()
            ->get()
            ->map(function ($method) {
                return [
                    'code' => $method->code,
                    'name' => $method->name,
                    'name_ar' => $method->name_ar,
                    'description' => $method->description,
                    'icon' => $method->icon,
                    'requires_proof' => $method->requiresProof(),
                    'is_online' => $method->isOnlinePayment(),
                ];
            })
            ->toArray();
    }

    /**
     * Initiate a payment flow.
     */
    public function initiatePayment(User $user, int $amount, string $method): array
    {
        // Validate amount
        $minAmount = config('wallet.minimum_topup', 50);
        $maxAmount = config('wallet.maximum_topup', 10000);

        if ($amount < $minAmount) {
            throw new \InvalidArgumentException("Le montant minimum est de {$minAmount} SOLD DIRHAM");
        }

        if ($amount > $maxAmount) {
            throw new \InvalidArgumentException("Le montant maximum est de {$maxAmount} SOLD DIRHAM");
        }

        // Get payment method
        $paymentMethod = PaymentMethod::findByCode($method);
        if (!$paymentMethod || !$paymentMethod->is_active) {
            throw new \InvalidArgumentException('Méthode de paiement non disponible');
        }

        return match ($method) {
            'bank_transfer' => $this->initiateBankTransfer($user, $amount),
            'cmi' => $this->initiateCmiPayment($user, $amount),
            'payzone' => $this->initiatePayzonePayment($user, $amount),
            'cashplus' => $this->initiateCashPlusPayment($user, $amount),
            default => throw new \InvalidArgumentException('Méthode de paiement non supportée'),
        };
    }

    /**
     * Initiate bank transfer (manual).
     */
    protected function initiateBankTransfer(User $user, int $amount): array
    {
        // Create pending top-up request
        $request = TopUpRequest::create([
            'user_id' => $user->id,
            'amount' => $amount,
            'method' => TopUpRequest::METHOD_BANK_TRANSFER,
            'status' => TopUpRequest::STATUS_PENDING,
            'payment_reference' => $this->generateReference('VIR'),
        ]);

        return [
            'type' => 'bank_transfer',
            'request_id' => $request->id,
            'reference' => $request->payment_reference,
            'amount' => $amount,
            'bank_details' => [
                'bank_name' => config('wallet.bank_transfer.bank_name'),
                'account_name' => config('wallet.bank_transfer.account_name'),
                'account_number' => config('wallet.bank_transfer.account_number'),
                'rib' => config('wallet.bank_transfer.rib'),
            ],
            'instructions' => 'Veuillez effectuer le virement et télécharger le reçu pour validation.',
            'next_step' => 'upload_proof',
        ];
    }

    /**
     * Initiate CMI payment.
     */
    protected function initiateCmiPayment(User $user, int $amount): array
    {
        $config = config('wallet.payment_gateways.cmi');

        if (!$config['enabled']) {
            throw new \RuntimeException('Le paiement par carte n\'est pas disponible actuellement');
        }

        // Create processing request
        $request = TopUpRequest::create([
            'user_id' => $user->id,
            'amount' => $amount,
            'method' => TopUpRequest::METHOD_CMI,
            'status' => TopUpRequest::STATUS_PROCESSING,
            'payment_reference' => $this->generateReference('CMI'),
        ]);

        // Build CMI payment parameters
        $params = $this->buildCmiPaymentParams($request, $amount, $config);

        return [
            'type' => 'redirect',
            'request_id' => $request->id,
            'reference' => $request->payment_reference,
            'gateway_url' => $config['api_url'],
            'params' => $params,
            'method' => 'POST',
        ];
    }

    /**
     * Build CMI payment parameters.
     */
    protected function buildCmiPaymentParams(TopUpRequest $request, int $amount, array $config): array
    {
        // Amount in MAD (conversion)
        $amountMad = $amount * config('wallet.conversion_rate', 1);

        $params = [
            'clientid' => $config['merchant_id'],
            'amount' => number_format($amountMad, 2, '.', ''),
            'currency' => '504', // MAD currency code
            'oid' => $request->payment_reference,
            'okUrl' => $config['ok_url'] ?? url('/api/payments/callback/cmi/success'),
            'failUrl' => $config['fail_url'] ?? url('/api/payments/callback/cmi/fail'),
            'callbackUrl' => $config['callback_url'] ?? url('/api/payments/webhook/cmi'),
            'shopurl' => url('/'),
            'lang' => 'fr',
            'TranType' => 'PreAuth',
            'storetype' => '3D_PAY_HOSTING',
            'hashAlgorithm' => 'ver3',
            'encoding' => 'UTF-8',
            'rnd' => microtime(),
        ];

        // Generate hash
        $params['hash'] = $this->generateCmiHash($params, $config['store_key']);

        return $params;
    }

    /**
     * Generate CMI hash signature.
     */
    protected function generateCmiHash(array $params, string $storeKey): string
    {
        $hashString = $params['clientid'] . '|' .
            $params['oid'] . '|' .
            $params['amount'] . '|' .
            $params['okUrl'] . '|' .
            $params['failUrl'] . '|' .
            $params['TranType'] . '|' .
            $params['rnd'] . '|' .
            $storeKey;

        return base64_encode(hash('sha512', $hashString, true));
    }

    /**
     * Initiate Payzone payment.
     */
    protected function initiatePayzonePayment(User $user, int $amount): array
    {
        $config = config('wallet.payment_gateways.payzone');

        if (!$config['enabled']) {
            throw new \RuntimeException('Payzone n\'est pas disponible actuellement');
        }

        // Create processing request
        $request = TopUpRequest::create([
            'user_id' => $user->id,
            'amount' => $amount,
            'method' => TopUpRequest::METHOD_PAYZONE,
            'status' => TopUpRequest::STATUS_PROCESSING,
            'payment_reference' => $this->generateReference('PZ'),
        ]);

        // TODO: Implement Payzone API integration
        // This would typically involve calling Payzone API to create a payment session

        return [
            'type' => 'redirect',
            'request_id' => $request->id,
            'reference' => $request->payment_reference,
            'gateway_url' => $config['api_url'] . '/checkout',
            'message' => 'Redirection vers Payzone...',
        ];
    }

    /**
     * Initiate Cash Plus payment.
     */
    protected function initiateCashPlusPayment(User $user, int $amount): array
    {
        $config = config('wallet.payment_gateways.cashplus');

        if (!$config['enabled']) {
            throw new \RuntimeException('Cash Plus n\'est pas disponible actuellement');
        }

        // Create pending request with reference
        $reference = $this->generateCashPlusReference();

        $request = TopUpRequest::create([
            'user_id' => $user->id,
            'amount' => $amount,
            'method' => TopUpRequest::METHOD_CASHPLUS,
            'status' => TopUpRequest::STATUS_PENDING,
            'payment_reference' => $reference,
            'metadata' => [
                'cash_plus_code' => $reference,
                'expires_at' => now()->addHours(24)->toIso8601String(),
            ],
        ]);

        return [
            'type' => 'cash_plus',
            'request_id' => $request->id,
            'reference' => $reference,
            'amount' => $amount,
            'amount_mad' => $amount * config('wallet.conversion_rate', 1),
            'expires_at' => now()->addHours(24)->toIso8601String(),
            'instructions' => "Présentez ce code dans un point Cash Plus et payez {$amount} MAD",
        ];
    }

    /**
     * Generate unique payment reference.
     */
    protected function generateReference(string $prefix = 'REF'): string
    {
        return $prefix . '-' . strtoupper(Str::random(8)) . '-' . time();
    }

    /**
     * Generate Cash Plus reference code.
     */
    protected function generateCashPlusReference(): string
    {
        // Format: 12 digit numeric code
        return str_pad(mt_rand(1, 999999999999), 12, '0', STR_PAD_LEFT);
    }

    /**
     * Handle payment callback (success/failure).
     */
    public function handleCallback(string $method, array $data): TopUpRequest
    {
        return match ($method) {
            'cmi' => $this->handleCmiCallback($data),
            'payzone' => $this->handlePayzoneCallback($data),
            default => throw new \InvalidArgumentException('Unknown payment method'),
        };
    }

    /**
     * Handle CMI callback.
     */
    protected function handleCmiCallback(array $data): TopUpRequest
    {
        $reference = $data['oid'] ?? null;
        $status = $data['Response'] ?? null;

        $request = TopUpRequest::where('payment_reference', $reference)
            ->where('method', TopUpRequest::METHOD_CMI)
            ->firstOrFail();

        if ($status === 'Approved') {
            return $this->completePayment($request, $data);
        }

        // Payment failed
        $request->update([
            'status' => TopUpRequest::STATUS_REJECTED,
            'admin_notes' => 'Paiement refusé par la banque: ' . ($data['ErrMsg'] ?? 'Unknown error'),
            'metadata' => array_merge($request->metadata ?? [], ['gateway_response' => $data]),
        ]);

        return $request;
    }

    /**
     * Handle Payzone callback.
     */
    protected function handlePayzoneCallback(array $data): TopUpRequest
    {
        $reference = $data['reference'] ?? null;

        $request = TopUpRequest::where('payment_reference', $reference)
            ->where('method', TopUpRequest::METHOD_PAYZONE)
            ->firstOrFail();

        if (($data['status'] ?? '') === 'success') {
            return $this->completePayment($request, $data);
        }

        // Payment failed
        $request->update([
            'status' => TopUpRequest::STATUS_REJECTED,
            'admin_notes' => 'Paiement Payzone échoué',
            'metadata' => array_merge($request->metadata ?? [], ['gateway_response' => $data]),
        ]);

        return $request;
    }

    /**
     * Complete a successful payment and credit wallet.
     */
    public function completePayment(TopUpRequest $request, array $gatewayData = []): TopUpRequest
    {
        return DB::transaction(function () use ($request, $gatewayData) {
            // Update request status
            $request->update([
                'status' => TopUpRequest::STATUS_APPROVED,
                'approved_at' => now(),
                'metadata' => array_merge($request->metadata ?? [], ['gateway_response' => $gatewayData]),
            ]);

            // Credit wallet
            $source = match ($request->method) {
                TopUpRequest::METHOD_CMI => WalletTransaction::SOURCE_CMI,
                TopUpRequest::METHOD_PAYZONE => WalletTransaction::SOURCE_PAYZONE,
                TopUpRequest::METHOD_CASHPLUS => WalletTransaction::SOURCE_CASHPLUS,
                default => WalletTransaction::SOURCE_BANK_TRANSFER,
            };

            $this->walletService->credit(
                $request->user,
                $request->amount,
                WalletTransaction::TYPE_ONLINE_PAYMENT,
                $source,
                "Recharge via {$request->method_label}",
                $request
            );

            return $request->fresh();
        });
    }

    /**
     * Validate webhook signature.
     */
    public function validateWebhook(string $method, array $data, string $signature): bool
    {
        return match ($method) {
            'cmi' => $this->validateCmiWebhook($data, $signature),
            'payzone' => $this->validatePayzoneWebhook($data, $signature),
            default => false,
        };
    }

    /**
     * Validate CMI webhook signature.
     */
    protected function validateCmiWebhook(array $data, string $signature): bool
    {
        $storeKey = config('wallet.payment_gateways.cmi.store_key');
        $expectedHash = $this->generateCmiHash($data, $storeKey);
        return hash_equals($expectedHash, $signature);
    }

    /**
     * Validate Payzone webhook signature.
     */
    protected function validatePayzoneWebhook(array $data, string $signature): bool
    {
        $apiKey = config('wallet.payment_gateways.payzone.api_key');
        $expectedSignature = hash_hmac('sha256', json_encode($data), $apiKey);
        return hash_equals($expectedSignature, $signature);
    }
}
