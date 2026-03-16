<?php

namespace App\Http\Resources;

use App\Models\TopUpRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\WalletTransaction */
class WalletTransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $receiptUrl = null;
        if ($this->reference_type === TopUpRequest::class && $this->reference?->proof_image) {
            $receiptUrl = $this->reference->proof_image_url;
        }

        return [
            'id' => $this->id,
            'amount' => $this->amount,
            'formatted_amount' => $this->formatted_amount,
            'type' => $this->type,
            'type_label' => $this->type_label,
            'source' => $this->source,
            'source_label' => $this->source_label,
            'description' => $this->description,
            'status' => 'completed',
            'created_at' => $this->created_at?->toIso8601String(),
            'receipt_url' => $receiptUrl,
        ];
    }
}
