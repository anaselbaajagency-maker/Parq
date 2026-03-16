<?php

namespace App\Jobs;

use App\Models\Listing;
use App\Models\ListingImage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class OptimizeListingImagesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(private int $listingId)
    {
        $this->onQueue((string) config('performance.queues.media', 'media'));
    }

    public function tries(): int
    {
        return max((int) config('queue.defaults.tries', 3), 1);
    }

    public function backoff(): array
    {
        $baseBackoff = max((int) config('queue.defaults.backoff_seconds', 60), 1);

        return [
            $baseBackoff,
            $baseBackoff * 5,
            $baseBackoff * 15,
        ];
    }

    public function handle(): void
    {
        $listing = Listing::query()->with('images')->find($this->listingId);
        if (! $listing) {
            return;
        }

        // Listing has both a JSON attribute named "images" and a hasMany relation "images".
        // Access relation explicitly to avoid reading the nullable JSON column by mistake.
        $imageRows = $listing->relationLoaded('images')
            ? $listing->getRelation('images')
            : $listing->images()->get();

        // If only legacy JSON images exist, ensure structured rows are present.
        $legacyImages = $listing->getRawOriginal('images');
        $decodedLegacyImages = is_string($legacyImages) ? json_decode($legacyImages, true) : null;

        if ($imageRows->isEmpty() && is_array($decodedLegacyImages)) {
            foreach ($decodedLegacyImages as $index => $path) {
                if (! is_string($path) || trim($path) === '') {
                    continue;
                }

                ListingImage::updateOrCreate(
                    ['listing_id' => $listing->id, 'image_path' => $path],
                    ['is_main' => $index === 0, 'sort_order' => $index]
                );
            }

            $imageRows = $listing->images()->get();
        }

        if ($imageRows->isEmpty()) {
            return;
        }

        $images = $imageRows->sortBy('sort_order')->values();
        $mainImage = $images->firstWhere('is_main', true) ?? $images->first();

        foreach ($images as $index => $image) {
            $image->update([
                'sort_order' => $index,
                'is_main' => $image->id === $mainImage?->id,
            ]);
        }

        if (! $listing->image_hero && $mainImage?->image_path) {
            $listing->image_hero = $mainImage->image_path;
            $listing->save();
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('OptimizeListingImagesJob failed', [
            'listing_id' => $this->listingId,
            'message' => $exception->getMessage(),
        ]);
    }
}
