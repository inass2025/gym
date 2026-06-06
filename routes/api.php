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
use App\Http\Controllers\RegimeController;

/*
|--------------------------------------------------------------------------
| 🔓 PUBLIC ROUTES — Sans authentification
|--------------------------------------------------------------------------
*/
Route::post('/notifications', [NotificationController::class, 'store']);
// Auth
Route::post('/register',       [AuthController::class, 'registerAdherent']);
Route::post('/register-coach', [AuthController::class, 'registerCoach']);
Route::post('/login',          [AuthController::class, 'login']);

// Cours — lecture publique
Route::get('/cours',        [CoursController::class, 'index']);
Route::get('/coaches-list', [CoursController::class, 'coachesList']);

// Regimes
Route::get('/regimes', [RegimeController::class, 'index']);

// Messages publics
Route::get('/messages/{adherent_id}/{coach_id}', [MessageController::class, 'index']);
Route::post('/messages',                         [MessageController::class, 'store']);

// Notifications publiques
Route::get('/notifications/{adherentId}',                    [NotificationController::class, 'index']);
Route::patch('/notifications/{id}/lu',                       [NotificationController::class, 'markAsRead']);
Route::patch('/notifications/adherent/{adherentId}/lu-tout', [NotificationController::class, 'markAllAsRead']);

// Reservations actions publiques
Route::patch('/reservations/{id}/accepter', [ReservationController::class, 'accepter']);
Route::patch('/reservations/{id}/refuser',  [ReservationController::class, 'refuser']);
// Zid hadi ma3 les routes publiques
Route::get('/reservation', [ReservationController::class, 'index']);


// Adherents
Route::get('/adherents',                      [AdherentController::class, 'index']);
Route::post('/adherents',                     [AdherentController::class, 'store']);
Route::get('/adherents/{adherent}',           [AdherentController::class, 'show']);
Route::put('/adherents/{adherent}',           [AdherentController::class, 'update']);
Route::delete('/adherents/{adherent}',        [AdherentController::class, 'destroy']);
Route::patch('/adherents/{adherent}/bloquer', [AdherentController::class, 'bloquer']);
Route::put('/adherents/{adherent}', [AdherentController::class, 'update']);  // ← public
Route::put('/profile',              [AdherentController::class, 'updateProfile']); // ← protected

// Coachs
Route::prefix('coachs')->group(function () {
    Route::get('/',               [CoachController::class, 'index']);
    Route::get('/{id}',           [CoachController::class, 'show']);
    Route::get('/{id}/clients',   [CoachController::class, 'clients']);
    Route::get('/{id}/planning',  [CoachController::class, 'planning']);
    Route::post('/',              [CoachController::class, 'store']);
    Route::put('/{id}',           [CoachController::class, 'update']);
    Route::post('/{id}',          [CoachController::class, 'update']);
    Route::delete('/{id}',        [CoachController::class, 'destroy']);
    Route::patch('/{id}/bloquer', [CoachController::class, 'toggleBloque']);
    Route::put('/{id}/password',  [CoachController::class, 'changePassword']);
});

// Aliases frontend — public (lecture seulement)
Route::get('/coaches',          [CoachController::class, 'index']);
Route::get('/check-abonnement', [AbonnementController::class, 'check']);

// Cours écriture
Route::post('/cours',        [CoursController::class, 'store']);
Route::put('/cours/{id}',    [CoursController::class, 'update']);
Route::delete('/cours/{id}', [CoursController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| 🔐 PROTECTED ROUTES — auth:sanctum
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Alias frontend — souscrire (besoin auth)
    Route::post('/abonnement/souscrire', [AbonnementController::class, 'souscrire']);

    /*
    |--------------------------------------------------------------------------
    | 👤 Auth & Profile
    |--------------------------------------------------------------------------
    */
    Route::post('/profile/photo', [AdherentController::class, 'updatePhoto']); 
    // Route::put('/profile', [AdherentController::class, 'updateProfile']);
    Route::post('/logout',          [AuthController::class, 'logout']);
    Route::post('/change-password', [PasswordController::class, 'update']);
    Route::get('/profile',          [AdherentController::class, 'profile']);
    Route::put('/profile',          [AdherentController::class, 'updateProfile']);
    Route::post('/profile',         [AdherentController::class, 'updateProfile']);

    /*
    |--------------------------------------------------------------------------
    | 📊 Dashboard
    |--------------------------------------------------------------------------
    */
    Route::get('/dashboard', function (Request $request) {
        $user = $request->user();
        $abo  = $user->abonnements()->first();

        return response()->json([
            'name'     => $user->nom . ' ' . $user->prenom,
            'status'   => $abo?->type ?? 'Active',
            'sessions' => $user->reservation()->count(),
        ]);
    });

    /*
    |--------------------------------------------------------------------------
    | 🎫 Abonnements
    |--------------------------------------------------------------------------
    */
    Route::get('/abonnements/all',                      [AbonnementController::class, 'all']);
    Route::get('/abonnements/check',                    [AbonnementController::class, 'check']);
    Route::get('/abonnements/expiration-proche',        [AbonnementController::class, 'expirationProche']);
    Route::get('/abonnements/historique/{adherent_id}', [AbonnementController::class, 'historique']);
    Route::post('/abonnements/souscrire',               [AbonnementController::class, 'souscrire']);
    Route::post('/abonnements/expire-automatique',      [AbonnementController::class, 'expireAutomatique']);

    Route::get('/abonnements',           [AbonnementController::class, 'index']);
    Route::post('/abonnements',          [AbonnementController::class, 'store']);
    Route::get('/abonnements/{id}',      [AbonnementController::class, 'show']);
    Route::put('/abonnements/{id}',      [AbonnementController::class, 'update']);
    Route::delete('/abonnements/{id}',   [AbonnementController::class, 'destroy']);
    Route::post('/abonnements/{id}/suspendre',  [AbonnementController::class, 'suspendre']);
    Route::post('/abonnements/{id}/renouveler', [AbonnementController::class, 'renouveler']);

    /*
    |--------------------------------------------------------------------------
    | 💰 Paiements
    |--------------------------------------------------------------------------
    */
    Route::get('/paiements/en-retard',                [PaiementController::class, 'enRetard']);
    Route::get('/paiements/statistiques',             [PaiementController::class, 'statistiques']);
    Route::get('/paiements/historique/{adherent_id}', [PaiementController::class, 'historique']);

    Route::get('/paiements',         [PaiementController::class, 'index']);
    Route::post('/paiements',        [PaiementController::class, 'store']);
    Route::get('/paiements/{id}',    [PaiementController::class, 'show']);
    Route::put('/paiements/{id}',    [PaiementController::class, 'update']);
    Route::delete('/paiements/{id}', [PaiementController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | 📅 Reservations
    |--------------------------------------------------------------------------
    */
    Route::get('/reservations',         [ReservationController::class, 'index']);
    Route::post('/reserve',             [ReservationController::class, 'store']);
    Route::get('/reservations/{id}',    [ReservationController::class, 'show']);
    Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);
    Route::get('/my-reservations',      [ReservationController::class, 'myReservations']);

    /*
    |--------------------------------------------------------------------------
    | 📈 Performances
    |--------------------------------------------------------------------------
    */
    Route::get('/performance',         [PerformanceController::class, 'index']);
    Route::post('/performance',        [PerformanceController::class, 'store']);
    Route::delete('/performance/{id}', [PerformanceController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | 📋 Programmes
    |--------------------------------------------------------------------------
    */
    Route::get('/programmes',         [ProgrammeController::class, 'index']);
    Route::post('/programmes',        [ProgrammeController::class, 'store']);
    Route::put('/programmes/{id}',    [ProgrammeController::class, 'update']);
    Route::delete('/programmes/{id}', [ProgrammeController::class, 'destroy']);
    Route::get('/mon-programme',      [ProgrammeController::class, 'monProgramme']);

    /*
    |--------------------------------------------------------------------------
    | 🥗 Regimes
    |--------------------------------------------------------------------------
    */
    Route::post('/regimes',        [RegimeController::class, 'store']);
    Route::delete('/regimes/{id}', [RegimeController::class, 'destroy']);

});