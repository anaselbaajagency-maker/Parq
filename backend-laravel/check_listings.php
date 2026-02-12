<?php

use App\Models\Listing;
use App\Models\User;

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Find the user who has listings (assuming it's the one logged in or active)
// We'll list stats for users with listings
$users = User::has('listings')->withCount('listings')->get();

foreach ($users as $user) {
    echo 'User: '.$user->full_name.' (ID: '.$user->id.")\n";
    echo 'Total Listings: '.$user->listings_count."\n";

    $byStatus = Listing::where('user_id', $user->id)
        ->select('status', \DB::raw('count(*) as total'))
        ->groupBy('status')
        ->get();

    foreach ($byStatus as $stat) {
        echo " - Status '{$stat->status}': {$stat->total}\n";
    }
    echo "------------------------\n";
}
