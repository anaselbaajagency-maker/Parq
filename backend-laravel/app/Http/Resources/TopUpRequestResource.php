<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\TopUpRequest */
class TopUpRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => $this->whenLoaded('user', fn () => new UserResource($this->user)),
            'amount' => $this->amount,
            'method' => $this->method,
            'method_label' => $this->method_label,
            'status' => $this->status,
            'status_label' => $this->status_label,
            'status_color' => $this->status_color,
            'reference' => $this->payment_reference,
            'proof_image' => $this->proof_image_url,
            'admin_notes' => $this->admin_notes,
            'approved_at' => $this->approved_at?->toIso8601String(),
            'approver' => $this->whenLoaded('approver', function () {
                if (! $this->approver) {
                    return null;
                }

                return [
                    'id' => $this->approver->id,
                    'full_name' => $this->approver->full_name,
                ];
            }),
            'metadata' => $this->metadata,
            'bank_details' => $this->method === 'bank_transfer' ? [
                'bank_name' => config('wallet.bank_transfer.bank_name'),
                'account_name' => config('wallet.bank_transfer.account_name'),
                'account_number' => config('wallet.bank_transfer.account_number'),
                'rib' => config('wallet.bank_transfer.rib'),
            ] : null,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
