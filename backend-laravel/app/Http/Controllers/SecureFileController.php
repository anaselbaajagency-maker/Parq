<?php

namespace App\Http\Controllers;

use App\Models\TopUpRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class SecureFileController extends Controller
{
    public function topUpProof(Request $request, TopUpRequest $topUpRequest): Response
    {
        if (! $topUpRequest->proof_image) {
            abort(404);
        }

        if (! Storage::disk('local')->exists($topUpRequest->proof_image)) {
            abort(404);
        }

        return Storage::disk('local')->response(
            $topUpRequest->proof_image,
            basename($topUpRequest->proof_image),
            [
                'Cache-Control' => 'private, max-age=60',
            ]
        );
    }
}
