<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TopUpRequest extends Model
{
    // Status constants
    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_PROCESSING = 'processing';

    // Method constants
    const METHOD_BANK_TRANSFER = 'bank_transfer';
    const METHOD_CMI = 'cmi';
    const METHOD_PAYZONE = 'payzone';
    const METHOD_CASHPLUS = 'cashplus';

    protected $table = 'topup_requests';

    protected $fillable = [
        'user_id',
        'amount',
        'method',
        'status',
        'proof_image',
        'payment_reference',
        'admin_notes',
        'approved_by',
        'approved_at',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'integer',
        'approved_at' => 'datetime',
        'metadata' => 'array',
    ];

    protected $attributes = [
        'status' => self::STATUS_PENDING,
    ];

    /**
     * Get the user who made this request.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin who approved/rejected this request.
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Check if request is pending.
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if request is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    /**
     * Check if request is rejected.
     */
    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

    /**
     * Check if request is processing.
     */
    public function isProcessing(): bool
    {
        return $this->status === self::STATUS_PROCESSING;
    }

    /**
     * Mark as approved.
     */
    public function approve(User $admin, ?string $notes = null): self
    {
        $this->update([
            'status' => self::STATUS_APPROVED,
            'approved_by' => $admin->id,
            'approved_at' => now(),
            'admin_notes' => $notes,
        ]);

        return $this;
    }

    /**
     * Mark as rejected.
     */
    public function reject(User $admin, string $notes): self
    {
        $this->update([
            'status' => self::STATUS_REJECTED,
            'approved_by' => $admin->id,
            'approved_at' => now(),
            'admin_notes' => $notes,
        ]);

        return $this;
    }

    /**
     * Get the method label for display.
     */
    public function getMethodLabelAttribute(): string
    {
        return match ($this->method) {
            self::METHOD_BANK_TRANSFER => 'Virement Bancaire',
            self::METHOD_CMI => 'Carte Bancaire (CMI)',
            self::METHOD_PAYZONE => 'Payzone',
            self::METHOD_CASHPLUS => 'Cash Plus',
            default => $this->method,
        };
    }

    /**
     * Get the status label for display.
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_PENDING => 'En attente',
            self::STATUS_APPROVED => 'Approuvé',
            self::STATUS_REJECTED => 'Rejeté',
            self::STATUS_PROCESSING => 'En cours',
            default => $this->status,
        };
    }

    /**
     * Get the status color for UI.
     */
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_PENDING => 'yellow',
            self::STATUS_APPROVED => 'green',
            self::STATUS_REJECTED => 'red',
            self::STATUS_PROCESSING => 'blue',
            default => 'gray',
        };
    }

    /**
     * Scope to filter by status.
     */
    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to get pending requests.
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope to get approved requests.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    /**
     * Get all valid methods.
     */
    public static function getMethods(): array
    {
        return [
            self::METHOD_BANK_TRANSFER,
            self::METHOD_CMI,
            self::METHOD_PAYZONE,
            self::METHOD_CASHPLUS,
        ];
    }

    /**
     * Get all valid statuses.
     */
    public static function getStatuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_APPROVED,
            self::STATUS_REJECTED,
            self::STATUS_PROCESSING,
        ];
    }
}
