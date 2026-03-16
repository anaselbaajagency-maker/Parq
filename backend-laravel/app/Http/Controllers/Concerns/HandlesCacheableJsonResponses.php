<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

trait HandlesCacheableJsonResponses
{
    protected function cacheableJson(
        Request $request,
        string $cacheKey,
        int $ttlSeconds,
        callable $resolver
    ): JsonResponse {
        if (! $this->cacheEnabled()) {
            return response()->json($resolver());
        }

        $store = $this->cacheStore();
        $repository = $store ? Cache::store($store) : Cache::store();
        $payload = $repository->remember($cacheKey, now()->addSeconds($ttlSeconds), $resolver);

        return $this->withHttpCacheHeaders($request, $payload, $ttlSeconds);
    }

    protected function withHttpCacheHeaders(Request $request, mixed $payload, int $ttlSeconds): JsonResponse
    {
        $encoded = json_encode($payload, JSON_UNESCAPED_UNICODE);
        $etag = '"'.sha1((string) $encoded).'"';

        if ($request->headers->get('If-None-Match') === $etag) {
            return response()->json(null, 304, [
                'ETag' => $etag,
                'Cache-Control' => $this->cacheControlHeader($ttlSeconds),
            ]);
        }

        return response()->json($payload)->withHeaders([
            'ETag' => $etag,
            'Cache-Control' => $this->cacheControlHeader($ttlSeconds),
        ]);
    }

    protected function cacheKeyFromRequest(string $prefix, Request $request): string
    {
        return Str::lower(sprintf(
            '%s:%s',
            $prefix,
            sha1($request->method().'|'.$request->fullUrl())
        ));
    }

    protected function publicCacheTtlSeconds(): int
    {
        return max((int) config('performance.cache.public_ttl_seconds', 60), 1);
    }

    protected function cacheEnabled(): bool
    {
        return (bool) config('performance.cache.enabled', true);
    }

    protected function cacheStore(): ?string
    {
        $store = (string) config('performance.cache.store', '');

        return $store === '' ? null : $store;
    }

    private function cacheControlHeader(int $ttlSeconds): string
    {
        $swr = max((int) config('performance.cache.stale_while_revalidate_seconds', 30), 0);

        return sprintf(
            'public, max-age=%d, s-maxage=%d, stale-while-revalidate=%d',
            $ttlSeconds,
            $ttlSeconds,
            $swr
        );
    }
}
