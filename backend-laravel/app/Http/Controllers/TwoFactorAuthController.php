<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PragmaRX\Google2FALaravel\Facade as Google2FA;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

class TwoFactorAuthController extends Controller
{
    /**
     * Get 2FA status for the authenticated user
     */
    public function status()
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json([
            'enabled' => !is_null($user->two_factor_confirmed_at),
            'confirmed' => !is_null($user->two_factor_confirmed_at),
        ]);
    }

    /**
     * Enable 2FA: Generate secret and QR code
     */
    public function enable(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        if ($user->two_factor_confirmed_at) {
            return response()->json(['message' => '2FA is already enabled'], 400);
        }

        // Generate a new secret if not already present
        if (!$user->two_factor_secret) {
            $user->two_factor_secret = Google2FA::generateSecretKey();
            $user->save();
        }

        $qrCodeUrl = Google2FA::getQRCodeUrl(
            config('app.name'),
            $user->email,
            $user->two_factor_secret
        );

        // Generate QR Code SVG
        $renderer = new ImageRenderer(
            new RendererStyle(200),
            new SvgImageBackEnd()
        );
        $writer = new Writer($renderer);
        $qrCodeSvg = $writer->writeString($qrCodeUrl);

        return response()->json([
            'secret' => $user->two_factor_secret,
            'qr_code_svg' => $qrCodeSvg,
            'qr_code_url' => $qrCodeUrl,
        ]);
    }

    /**
     * Confirm 2FA: Verify the code and activate 2FA
     */
    public function confirm(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $request->validate([
            'code' => 'required|string',
        ]);

        $valid = Google2FA::verifyKey($user->two_factor_secret, $request->code);

        if ($valid) {
            $user->two_factor_confirmed_at = now();
            // Generate recovery codes if needed
            if (!$user->two_factor_recovery_codes) {
                // Simplified recovery codes for now
                $user->two_factor_recovery_codes = json_encode([
                    bin2hex(random_bytes(10)),
                    bin2hex(random_bytes(10)),
                    bin2hex(random_bytes(10)),
                    bin2hex(random_bytes(10)),
                ]);
            }
            $user->save();

            return response()->json([
                'message' => 'Two-factor authentication confirmed successfully',
                'recovery_codes' => json_decode($user->two_factor_recovery_codes),
            ]);
        }

        return response()->json([
            'message' => 'Invalid verification code',
            'errors' => ['code' => ['Le code de vérification est invalide.']]
        ], 422);
    }

    /**
     * Disable 2FA
     */
    public function disable(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $user->two_factor_secret = null;
        $user->two_factor_recovery_codes = null;
        $user->two_factor_confirmed_at = null;
        $user->save();

        return response()->json([
            'message' => 'Two-factor authentication disabled successfully'
        ]);
    }
}
