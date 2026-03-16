<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\HandlesCacheableJsonResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListingRequest;
use App\Http\Requests\UpdateListingRequest;
use App\Http\Resources\ListingResource;
use App\Jobs\OptimizeListingImagesJob;
use App\Models\Listing;
use App\Notifications\ListingApprovedNotification;
use App\Notifications\ListingStatusChangedNotification;
use App\Services\ListingService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class ListingController extends Controller
{
    use HandlesCacheableJsonResponses;

    protected $listingService;

    public function __construct(ListingService $listingService)
    {
        $this->listingService = $listingService;
        // Middleware can be applied here or in routes
        // $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    /**
     * GET /api/listings
     */
    public function index(Request $request)
    {
        $query = Listing::query()->with(['category', 'city', 'images']);

        // Filters
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        if ($request->filled('price_min')) {
            $query->where('price', '>=', $request->price_min);
        }

        if ($request->filled('price_max')) {
            $query->where('price', '<=', $request->price_max);
        }

        if ($request->filled('type')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('type', $request->type);
            });
        }

        // Status: By default only active, unless owner/admin
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            $user = Auth::guard('sanctum')->user();
            $isOwner = $user && $request->filled('user_id') && $request->user_id == $user->id;
            $isAdmin = $user && $user->isAdmin();

            if (! $isOwner && ! $isAdmin) {
                $query->where('status', 'active');
            }
        }

        // Sorting
        $sort = $request->input('sort', 'newest');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc')->orderBy('id', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc')->orderBy('id', 'desc');
                break;
            case 'nearest':
                if ($request->filled('latitude') && $request->filled('longitude')) {
                    // Basic Haversine or simple Euclidean for MVP if DB not spatial configured
                    // For brevity, just sort by ID or simple SQL math if needed,
                    // but standard Eloquent doesn't support distance sort easily without RAW
                    // Skipping complex geo-sort for this snippet, fallback to newest
                    $query->orderBy('created_at', 'desc')->orderBy('id', 'desc');
                } else {
                    $query->orderBy('created_at', 'desc')->orderBy('id', 'desc');
                }
                break;
            case 'featured':
                $query->where('is_featured', true)->orderBy('created_at', 'desc')->orderBy('id', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc')->orderBy('id', 'desc');
                break;
        }

        $payloadResolver = fn () => $this->paginateQuery($query, $request, (int) config('performance.pagination.default_per_page', 15));
        if ($this->canUsePublicListingsCache($request)) {
            return $this->cacheableJson(
                $request,
                $this->cacheKeyFromRequest('listings:v'.$this->listingCacheVersion().':index', $request),
                $this->publicCacheTtlSeconds(),
                $payloadResolver
            );
        }

        return response()->json($payloadResolver())->withHeaders([
            'Cache-Control' => 'no-store',
        ]);
    }

    /**
     * POST /api/listings
     */
    public function store(StoreListingRequest $request)
    {
        $validated = $request->validated();

        // Handle image uploads if present
        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $file) {
                // Determine storage path
                $path = $file->store('listings', 'public');
                // Generate full URL
                $url = asset('storage/'.$path);
                $imagePaths[] = $url; // Service expects array of strings (paths)
            }
            $validated['images'] = $imagePaths;
        }

        $userId = Auth::guard('sanctum')->id();
        if (! $userId) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $listing = $this->listingService->createListing($validated, $userId);
        OptimizeListingImagesJob::dispatch($listing->id);
        $this->bumpListingCacheVersion();

        return response()->json((new ListingResource($listing))->resolve(), 201);
    }

    /**
     * GET /api/listings/{id}
     */
    public function show($id)
    {
        $request = request();
        $isGuest = ! Auth::guard('sanctum')->check();

        if ($isGuest) {
            return $this->cacheableJson(
                $request,
                'listings:v'.$this->listingCacheVersion().':show:'.sha1((string) $id),
                $this->publicCacheTtlSeconds(),
                function () use ($id) {
                    $query = Listing::with(['category', 'city', 'images', 'user', 'car', 'machinery', 'transport', 'driver'])
                        ->where('status', 'active');

                    $listing = is_numeric($id)
                        ? $query->where('id', $id)->firstOrFail()
                        : $query->where('slug', $id)->firstOrFail();

                    return (new ListingResource($listing))->resolve();
                }
            );
        }

        $query = Listing::with(['category', 'city', 'images', 'user', 'car', 'machinery', 'transport', 'driver']);
        $listing = is_numeric($id)
            ? $query->where('id', $id)->firstOrFail()
            : $query->where('slug', $id)->firstOrFail();

        // Visibility Restriction: Only owner or admin can see non-active listings
        if ($listing->status !== 'active') {
            $user = Auth::guard('sanctum')->user();
            $isOwner = $user && $user->id === $listing->user_id;
            $isAdmin = $user && $user->isAdmin();

            if (! $isOwner && ! $isAdmin) {
                return response()->json([
                    'message' => 'This listing is not currently available.',
                    'status' => $listing->status,
                ], 403);
            }
        }

        return response()->json((new ListingResource($listing))->resolve())->withHeaders([
            'Cache-Control' => 'no-store',
        ]);
    }

    /**
     * PUT /api/listings/{id}
     */
    public function update(UpdateListingRequest $request, $id)
    {
        $listing = Listing::findOrFail($id);
        $user = Auth::guard('sanctum')->user();

        if (! $user || ($listing->user_id !== $user->id && ! $user->isAdmin())) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $data = $request->validated();
        $oldStatus = $listing->status;

        // Include files explicitly as they might not be in validated() if rules are basic
        if ($request->hasFile('image_hero')) {
            $data['image_hero'] = $request->file('image_hero');
        }
        if ($request->hasFile('images')) {
            $data['images'] = $request->file('images');
        }
        if ($request->has('existing_images')) {
            $data['existing_images'] = $request->input('existing_images');
        }

        \Illuminate\Support\Facades\Log::info('Updating Listing ID: '.$id, [
            'has_hero' => isset($data['image_hero']),
            'images_count' => isset($data['images']) ? count($data['images']) : 0,
            'existing_count' => isset($data['existing_images']) ? count($data['existing_images']) : 0,
        ]);

        $updatedListing = $this->listingService->updateListing($listing, $data);
        OptimizeListingImagesJob::dispatch($listing->id);
        $this->bumpListingCacheVersion();

        if (isset($data['status']) && $data['status'] !== $oldStatus) {
            $message = $data['status'] === 'paused' 
                ? "Votre annonce a été mise en pause." 
                : "Votre annonce est maintenant active.";
                
            $listing->user->notify(new ListingStatusChangedNotification(
                $listing->id,
                $listing->title,
                $data['status'],
                $message
            ));
        }

        return response()->json((new ListingResource($updatedListing))->resolve());
    }

    /**
     * DELETE /api/listings/{id}
     */
    public function destroy($id)
    {
        $listing = Listing::findOrFail($id);
        $user = Auth::guard('sanctum')->user();

        if (! $user || ($listing->user_id !== $user->id && ! $user->isAdmin())) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $listing->delete();
        $this->bumpListingCacheVersion();

        return response()->json(['message' => 'Deleted successfully']);
    }

    /**
     * DELETE /api/admin/listings/bulk-delete
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:listings,id',
        ]);

        $user = Auth::guard('sanctum')->user();
        if (!$user || !$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $ids = $request->input('ids');
        Listing::whereIn('id', $ids)->delete();
        $this->bumpListingCacheVersion();

        return response()->json(['message' => count($ids) . ' listings deleted successfully']);
    }

    /**
     * POST /api/listings/{id}/pause
     */
    public function pause($id)
    {
        $listing = Listing::findOrFail($id);

        // Allow Owner OR Admin
        if (auth()->id() !== $listing->user_id && ! auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Toggle or set to inactive
        // Support both 'hidden' and 'inactive' as paused states for backward compatibility logic
        $isPaused = in_array($listing->status, ['hidden', 'inactive']);

        $listing->status = $isPaused ? 'active' : 'hidden';
        $listing->is_available = ($listing->status === 'active');
        $listing->save();
        $this->bumpListingCacheVersion();

        return response()->json(['status' => $listing->status, 'is_available' => $listing->is_available]);
    }

    /**
     * POST /api/listings/{id}/view
     */
    public function recordView($id)
    {
        if (is_numeric($id)) {
            $listing = Listing::findOrFail($id);
        } else {
            $listing = Listing::where('slug', $id)->firstOrFail();
        }

        $listing->increment('views');

        // Record historical view
        \App\Models\ListingView::create([
            'listing_id' => $listing->id,
            'user_id' => Auth::id(), // Nullable if guest
        ]);

        return response()->json(['views' => $listing->views]);
    }

    /**
     * POST /api/listings/{id}/favorite
     */
    public function toggleFavorite($id)
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $listing = Listing::findOrFail($id);

        $user->favorites()->toggle($listing->id);

        $isFavorited = $user->favorites()->where('listing_id', $listing->id)->exists();

        return response()->json([
            'is_favorited' => $isFavorited,
            'message' => $isFavorited ? 'Added to favorites' : 'Removed from favorites',
        ]);
    }

    /**
     * Admin Index
     */
    public function adminIndex(Request $request)
    {
        // Admin sees ALL listings (active, inactive, pending)
        $query = Listing::with(['category', 'city', 'user'])
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($this->paginateQuery($query, $request, 20))->withHeaders([
            'Cache-Control' => 'no-store',
        ]);
    }

    /**
     * Get Listings by Category
     */
    public function getByCategory(Request $request, $category)
    {
        $query = Listing::with(['category', 'city', 'user', 'images'])
            ->where('status', 'active');

        // Check if $category is numeric ID or Slug
        if (is_numeric($category)) {
            $query->where('category_id', $category);
        } else {
            $query->whereHas('category', function ($q) use ($category) {
                $q->where('slug', $category);
            });
        }

        if ($request->has('city')) {
            $city = $request->city;
            $query->whereHas('city', function ($q) use ($city) {
                $q->where('id', $city)->orWhere('slug', $city);
            });
        }

        $query->orderBy('created_at', 'desc')->orderBy('id', 'desc');

        return $this->cacheableJson(
            $request,
            $this->cacheKeyFromRequest('listings:v'.$this->listingCacheVersion().':category:'.$category, $request),
            $this->publicCacheTtlSeconds(),
            fn () => $this->paginateQuery($query, $request, (int) $request->get('limit', 15))
        );
    }

    /**
     * Homepage Listings
     */
    public function homepage()
    {
        return $this->cacheableJson(
            request(),
            'listings:v'.$this->listingCacheVersion().':homepage',
            $this->publicCacheTtlSeconds(),
            function () {
                $latest = Listing::with(['category', 'city', 'user', 'images'])
                    ->where('status', 'active')
                    ->orderBy('created_at', 'desc')
                    ->take(8)
                    ->get();

                $featured = Listing::with(['category', 'city', 'user', 'images'])
                    ->where('status', 'active')
                    ->where('is_featured', true)
                    ->orderBy('created_at', 'desc')
                    ->take(4)
                    ->get();

                return [
                    'latest' => ListingResource::collection($latest)->resolve(),
                    'featured' => ListingResource::collection($featured)->resolve(),
                ];
            }
        );
    }

    /**
     * POST /api/admin/listings/{id}/toggle-featured
     */
    public function toggleFeatured($id)
    {
        $listing = Listing::findOrFail($id);
        $listing->is_featured = ! $listing->is_featured;
        $listing->save();
        $this->bumpListingCacheVersion();

        return response()->json([
            'message' => $listing->is_featured ? 'Listing marked as featured' : 'Listing removed from featured',
            'is_featured' => $listing->is_featured
        ]);
    }

    /**
     * POST /api/admin/listings/{id}/approve
     */
    public function approve($id)
    {
        $listing = Listing::findOrFail($id);
        $listing->status = 'active';
        $listing->save();
        $this->bumpListingCacheVersion();

        // Send Notification
        if ($listing->user) {
            $listing->user->notify(new ListingApprovedNotification($listing));
            
            $listing->user->notify(new ListingStatusChangedNotification(
                $listing->id,
                $listing->title,
                'active',
                "Votre annonce a été approuvée par l'administrateur."
            ));
        }

        return response()->json(['message' => 'Listing approved', 'status' => 'active']);
    }

    /**
     * POST /api/admin/listings/{id}/reject
     */
    public function reject(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        $listing = Listing::findOrFail($id);
        $listing->status = 'rejected';
        $listing->rejection_reason = $request->input('reason');
        $listing->save();
        $this->bumpListingCacheVersion();

        if ($listing->user) {
            $listing->user->notify(new ListingStatusChangedNotification(
                $listing->id,
                $listing->title,
                'rejected',
                "Votre annonce a été rejetée par l'administrateur. Raison: " . $listing->rejection_reason
            ));
        }

        return response()->json(['message' => 'Listing rejected', 'status' => 'rejected', 'rejection_reason' => $listing->rejection_reason]);
    }

    private function canUsePublicListingsCache(Request $request): bool
    {
        if (Auth::guard('sanctum')->check()) {
            return false;
        }

        return ! $request->filled('user_id') && ! $request->filled('status');
    }

    private function paginateQuery(Builder $query, Request $request, int $defaultPerPage = 15): array
    {
        $perPage = $this->resolvePerPage($request, $defaultPerPage);

        if ($this->wantsCursorPagination($request)) {
            $cursorPaginator = $query->cursorPaginate(
                $perPage,
                ['*'],
                'cursor',
                $request->query('cursor')
            );

            return array_merge($cursorPaginator->toArray(), [
                'pagination_type' => 'cursor',
            ]);
        }

        $paginator = $query->paginate($perPage);

        return array_merge($paginator->toArray(), [
            'pagination_type' => 'offset',
        ]);
    }

    private function wantsCursorPagination(Request $request): bool
    {
        $param = (string) config('performance.pagination.cursor_param', 'pagination');
        $value = (string) config('performance.pagination.cursor_value', 'cursor');

        return strtolower((string) $request->query($param, '')) === strtolower($value);
    }

    private function resolvePerPage(Request $request, int $defaultPerPage): int
    {
        $maxPerPage = max((int) config('performance.pagination.max_per_page', 50), 1);
        $value = (int) $request->query('per_page', $request->query('limit', $defaultPerPage));

        if ($value <= 0) {
            $value = $defaultPerPage;
        }

        return min($value, $maxPerPage);
    }

    private function listingCacheVersion(): int
    {
        return (int) Cache::get('listings_cache_version', 1);
    }

    private function bumpListingCacheVersion(): void
    {
        Cache::forever('listings_cache_version', $this->listingCacheVersion() + 1);
    }
}
