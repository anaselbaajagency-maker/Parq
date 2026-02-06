<?php

namespace App\Services;

use App\Models\User;
use App\Models\TopUpRequest;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class TopUpService
{
    protected WalletService $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    /**
     * Create a manual top-up request (bank transfer).
     */
    public function createManualRequest(
        User $user,
        int $amount,
        ?UploadedFile $proofImage = null
    ): TopUpRequest {
        // Validate amount
        $minAmount = config('wallet.minimum_topup', 50);
        $maxAmount = config('wallet.maximum_topup', 10000);

        if ($amount < $minAmount) {
            throw new \InvalidArgumentException("Le montant minimum est de {$minAmount} SOLD DIRHAM");
        }

        if ($amount > $maxAmount) {
            throw new \InvalidArgumentException("Le montant maximum est de {$maxAmount} SOLD DIRHAM");
        }

        // Store proof image if provided
        $proofPath = null;
        if ($proofImage) {
            $proofPath = $proofImage->store('topup-proofs/' . $user->id, 'public');
        }

        return TopUpRequest::create([
            'user_id' => $user->id,
            'amount' => $amount,
            'method' => TopUpRequest::METHOD_BANK_TRANSFER,
            'status' => TopUpRequest::STATUS_PENDING,
            'proof_image' => $proofPath,
            'payment_reference' => 'VIR-' . strtoupper(uniqid()) . '-' . time(),
        ]);
    }

    /**
     * Upload proof for an existing request.
     */
    public function uploadProof(TopUpRequest $request, UploadedFile $proofImage): TopUpRequest
    {
        if (!$request->isPending()) {
            throw new \RuntimeException('Cette demande ne peut plus être modifiée');
        }

        // Delete old proof if exists
        if ($request->proof_image) {
            Storage::disk('public')->delete($request->proof_image);
        }

        $proofPath = $proofImage->store('topup-proofs/' . $request->user_id, 'public');

        $request->update(['proof_image' => $proofPath]);

        return $request->fresh();
    }

    /**
     * Approve a top-up request.
     */
    public function approve(TopUpRequest $request, User $admin, ?string $notes = null): TopUpRequest
    {
        if (!$request->isPending()) {
            throw new \RuntimeException('Cette demande a déjà été traitée');
        }

        return DB::transaction(function () use ($request, $admin, $notes) {
            // Update request status
            $request->approve($admin, $notes);

            // Determine transaction type and source
            $type = WalletTransaction::TYPE_TOPUP_MANUAL;
            $source = WalletTransaction::SOURCE_BANK_TRANSFER;

            if ($request->method === TopUpRequest::METHOD_CASHPLUS) {
                $source = WalletTransaction::SOURCE_CASHPLUS;
            }

            // Credit wallet
            $this->walletService->credit(
                $request->user,
                $request->amount,
                $type,
                $source,
                "Recharge approuvée: {$request->payment_reference}",
                $request,
                [
                    'approved_by' => $admin->id,
                    'approved_at' => now()->toIso8601String(),
                ]
            );

            return $request->fresh();
        });
    }

    /**
     * Reject a top-up request.
     */
    public function reject(TopUpRequest $request, User $admin, string $reason): TopUpRequest
    {
        if (!$request->isPending() && !$request->isProcessing()) {
            throw new \RuntimeException('Cette demande a déjà été traitée');
        }

        $request->reject($admin, $reason);

        // TODO: Send notification to user about rejection

        return $request->fresh();
    }

    /**
     * Get all pending top-up requests (for admin).
     */
    public function getPendingRequests(): Collection
    {
        return TopUpRequest::pending()
            ->with('user:id,full_name,email,avatar')
            ->orderBy('created_at', 'asc')
            ->get();
    }

    /**
     * Get all top-up requests with filters (for admin).
     */
    public function getAllRequests(array $filters = []): Collection
    {
        $query = TopUpRequest::with('user:id,full_name,email,avatar', 'approver:id,full_name');

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['method'])) {
            $query->where('method', $filters['method']);
        }

        if (isset($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (isset($filters['from_date'])) {
            $query->whereDate('created_at', '>=', $filters['from_date']);
        }

        if (isset($filters['to_date'])) {
            $query->whereDate('created_at', '<=', $filters['to_date']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Get top-up requests for a specific user.
     */
    public function getUserRequests(User $user, int $limit = 20): Collection
    {
        return $user->topUpRequests()
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get();
    }

    /**
     * Cancel a pending request (by user).
     */
    public function cancel(TopUpRequest $request, User $user): TopUpRequest
    {
        if ($request->user_id !== $user->id) {
            throw new \RuntimeException('Vous n\'êtes pas autorisé à annuler cette demande');
        }

        if (!$request->isPending()) {
            throw new \RuntimeException('Cette demande ne peut plus être annulée');
        }

        // Delete proof image if exists
        if ($request->proof_image) {
            Storage::disk('public')->delete($request->proof_image);
        }

        $request->delete();

        return $request;
    }

    /**
     * Get statistics for admin dashboard.
     */
    public function getStatistics(): array
    {
        $today = now()->startOfDay();
        $thisMonth = now()->startOfMonth();

        return [
            'pending_count' => TopUpRequest::pending()->count(),
            'pending_amount' => TopUpRequest::pending()->sum('amount'),
            'approved_today' => TopUpRequest::approved()
                ->whereDate('approved_at', $today)
                ->count(),
            'approved_today_amount' => TopUpRequest::approved()
                ->whereDate('approved_at', $today)
                ->sum('amount'),
            'approved_this_month' => TopUpRequest::approved()
                ->where('approved_at', '>=', $thisMonth)
                ->count(),
            'approved_this_month_amount' => TopUpRequest::approved()
                ->where('approved_at', '>=', $thisMonth)
                ->sum('amount'),
        ];
    }
}
