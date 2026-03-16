<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('listings:bill-daily')->daily();

Schedule::command('queue:prune-failed --hours='.(int) config('queue.failed.prune_after_hours', 168))
    ->dailyAt('03:15');

Schedule::command('queue:prune-batches --hours='.(int) config('queue.failed.batch_prune_after_hours', 168))
    ->dailyAt('03:30');
