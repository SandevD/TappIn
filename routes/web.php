<?php

use App\Http\Controllers\CardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard',[
            'nfcVideoUrl' => asset('assets/lottie/nfc_scan.webm'),
        ]);
    })->name('dashboard');

    Route::post('link-card', [CardController::class, 'linkCard'])->name('link-card');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
