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

use App\Http\Controllers\PasswordController;
use App\Http\Controllers\ProgrammeController;



Route::middleware('auth:sanctum')->get('/mon-programme', [ProgrammeController::class, 'monProgramme']);

Route::middleware('auth:sanctum')->group(function () {
    // ... routes dyalek li kaynin
    Route::post('/change-password', [PasswordController::class, 'update']);
});
/*
|--------------------------------------------------------------------------
| 🔓 PUBLIC ROUTES (بدون auth)
|--------------------------------------------------------------------------
*/
use App\Http\Controllers\RegimeController;



Route::put('/coach/{id}/password', [CoachController::class, 'changePassword']);
Route::post('/coach/{id}', [CoachController::class, 'update']);
Route::get('/regimes', [RegimeController::class, 'index']);
Route::post('/regimes', [RegimeController::class, 'store']);
Route::delete('/regimes/{id}', [RegimeController::class, 'destroy']);
Route::post('/register', [AuthController::class, 'registerAdherent']);
Route::post('/register-coach', [AuthController::class, 'registerCoach']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| 🔐 PROTECTED ROUTES (auth:sanctum)
|--------------------------------------------------------------------------
*/


Route::patch('/reservations/{id}/accepter', [ReservationController::class, 'accepter']);
Route::patch('/reservations/{id}/refuser', [ReservationController::class, 'refuser']);
Route::put('/programmes/{id}', [ProgrammeController::class, 'update']);
Route::put('/programmes/{id}', [ProgrammeController::class, 'update']);


Route::middleware('auth:sanctum')->group(function () {

    // 🔹 Auth
    Route::post('/logout', [AuthController::class, 'logout']);

    // 🔹 ChangePassword
    Route::put('/coach/{id}/password', [CoachController::class, 'changePassword']);

    // 🔹 Profile
    Route::get('/profile', [AdherentController::class, 'profile']);
    Route::put('/profile', [AdherentController::class, 'update']);

    // 🔹 Dashboard
    Route::get('/dashboard', function (Request $request) {

    $user = $request->user();

    $abo = $user->abonnement()->first();

    return response()->json([
        'name'   => $user->name,
        'status' => $abo?->type ?? 'Active',
        'sessions' => $user->reservation()->count(),
    ]);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/performance',       [PerformanceController::class, 'index']);
    Route::post('/performance',      [PerformanceController::class, 'store']);
    Route::delete('/performance/{id}', [PerformanceController::class, 'destroy']);
});
Route::middleware('auth:sanctum')->get('/abonnements', [AbonnementController::class, 'index']);
    /*
    |--------------------------------------------------------------------------
    | 🎯 RESERVATION API (مهم)
    |--------------------------------------------------------------------------
    */

    // reserve cours
    Route::middleware('auth:sanctum')->group(function () {
    Route::get('/my-reservations',        [ReservationController::class, 'myReservations']); // ← جديد
    Route::get('/reservation', [ReservationController::class, 'index']);
    Route::get('/reservations/{id}',      [ReservationController::class, 'show']);
    Route::delete('/reservations/{id}',   [ReservationController::class, 'destroy']);
    Route::post('/reserve',               [ReservationController::class, 'store']);
    
    Route::get('/programmes', [ProgrammeController::class, 'index']);
    Route::post('/programmes', [ProgrammeController::class, 'store']);
    Route::delete('/programmes/{id}', [ProgrammeController::class, 'destroy']);
});

    /*
    |--------------------------------------------------------------------------
    | 📦 باقي الموارد
    |--------------------------------------------------------------------------
    */
        Route::middleware('auth:sanctum')->group(function () {
    Route::get('/abonnement',          [AbonnementController::class, 'show']);
    Route::get('/check-abonnement', [AbonnementController::class, 'check']);
    Route::post('/abonnement/souscrire', [AbonnementController::class, 'souscrire']); // ← جديد
});
    Route::apiResource('adherent', AdherentController::class);
    Route::apiResource('coach', CoachController::class);
    Route::apiResource('cours', CoursController::class);
    Route::apiResource('abonnement', AbonnementController::class);
    Route::apiResource('paiement', PaiementController::class);
    Route::apiResource('performance', PerformanceController::class);
    Route::apiResource('notification', NotificationController::class);
    Route::apiResource('message', MessageController::class);
});

// Messages
Route::get('/messages/{adherent_id}/{coach_id}', [MessageController::class, 'index']);
Route::post('/messages', [MessageController::class, 'store']);
Route::get('/coaches', function () {
    return \App\Models\Adherent::where('role', 'coach')->get();
});
Route::get('notifications/{adherentId}', [NotificationController::class, 'index']);
Route::patch('notifications/{id}/lu', [NotificationController::class, 'markAsRead']);
Route::patch('notifications/adherent/{adherentId}/lu-tout', [NotificationController::class, 'markAllAsRead']);