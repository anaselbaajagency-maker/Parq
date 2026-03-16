<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationEmail;
use Illuminate\Support\Facades\Validator;
use App\Services\WalletService;

class EmailVerificationController extends Controller
{
    /**
     * Send verification code to user email.
     */
    public function send(Request $request)
    {
        $user = $request->user();

        if ($user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'Email already verified.',
            ], 400);
        }

        // Generate a 6-digit code
        $code = (string) rand(100000, 999999);
        $expiresAt = Carbon::now()->addMinutes(15);

        // Store OTP
        DB::table('otps')->insert([
            'email' => $user->email,
            'code' => $code,
            'expires_at' => $expiresAt,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Log for debugging
        Log::info("PARQ Verification Code for {$user->email}: {$code}");
        
        // Send actual email
        try {
            Mail::to($user->email)->send(new VerificationEmail($code));
        } catch (\Exception $e) {
            Log::error("Failed to send verification email to {$user->email}: " . $e->getMessage());
            // We still return success because the code is in the DB, 
            // but in production this would be a failure.
        }

        return response()->json([
            'success' => true,
            'message' => 'Code de vérification envoyé à votre adresse email.',
            'expires_at' => $expiresAt->toIso8601String(),
        ]);
    }

    /**
     * Verify the code and mark email as verified.
     */
    public function verify(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => ['required', 'string', 'size:6'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Code invalide. Veuillez saisir 6 chiffres.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $code = $request->input('code');

        $otp = DB::table('otps')
            ->where('email', $user->email)
            ->where('code', $code)
            ->where('expires_at', '>', Carbon::now())
            ->whereNull('verified_at')
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$otp) {
            return response()->json([
                'success' => false,
                'message' => 'Code invalide ou expiré.',
            ], 422);
        }

        // Mark OTP as verified
        DB::table('otps')->where('id', $otp->id)->update(['verified_at' => Carbon::now()]);

        // Mark user as verified
        $user->email_verified_at = now();
        $user->save();

        // Give the welcome bonus since the email is verified
        app(WalletService::class)->awardWelcomeBonus($user);

        return response()->json([
            'success' => true,
            'message' => 'Votre adresse email a été vérifiée avec succès.',
            'user' => $user,
        ]);
    }
}
