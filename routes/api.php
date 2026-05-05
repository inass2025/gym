<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdherentController;
use App\Http\Controllers\CoachController;
use App\Http\Controllers\CoursController;
use App\Http\Controllers\AbonnementController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\PerformanceController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\MessageController;

/*
|--------------------------------------------------------------------------
| 🔓 PUBLIC ROUTES (بدون auth)
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'registerAdherent']);
Route::post('/register-coach', [AuthController::class, 'registerCoach']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| 🔐 PROTECTED ROUTES (auth:sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // 🔹 Auth
    Route::post('/logout', [AuthController::class, 'logout']);

    // 🔹 Profile
    Route::get('/profile', [AdherentController::class, 'profile']);
    Route::put('/profile', [AdherentController::class, 'update']);

    // 🔹 Dashboard
    Route::get('/dashboard', function (Request $request) {
        $user = $request->user();

        return [
            'name' => $user->name,
            'status' => 'Active',
            'sessions' => 5,
            'next_class' => 'Yoga 18:00',
            'expire' => '2026-05-25'
        ];
    });

    /*
    |--------------------------------------------------------------------------
    | 🎯 RESERVATION API (مهم)
    |--------------------------------------------------------------------------
    */

    // reserve cours
    Route::middleware('auth:sanctum')->group(function () {
    Route::get('/my-reservations',        [ReservationController::class, 'myReservations']); // ← جديد
    Route::get('/reservations/{id}',      [ReservationController::class, 'show']);
    Route::delete('/reservations/{id}',   [ReservationController::class, 'destroy']);
    Route::post('/reserve',               [ReservationController::class, 'store']);
});

    /*
    |--------------------------------------------------------------------------
    | 📦 باقي الموارد
    |--------------------------------------------------------------------------
    */
        
    Route::apiResource('adherent', AdherentController::class);
    Route::apiResource('coach', CoachController::class);
    Route::apiResource('cours', CoursController::class);
    Route::apiResource('abonnement', AbonnementController::class);
    Route::apiResource('paiement', PaiementController::class);
    Route::apiResource('performance', PerformanceController::class);
    Route::apiResource('notification', NotificationController::class);
    Route::apiResource('message', MessageController::class);
});