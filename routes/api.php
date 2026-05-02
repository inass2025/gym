<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdherentController;
use App\Http\Controllers\AbonnementController;
use App\Http\Controllers\CoachController;
use App\Http\Controllers\CoursController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\PerformanceController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\AuthController;

// Auth
Route::post('/register', [AuthController::class, 'registerAdherent']);
Route::post('/register-coach', [AuthController::class, 'registerCoach']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


Route::apiResource('adherent',AdherentController::class);
Route::apiResource('coach',CoachController::class);
Route::apiResource('cours',CoursController::class);
Route::apiResource('abonnement',AbonnementController::class);
Route::apiResource('paiement',PaiementController::class);
Route::apiResource('reservation',ReservationController::class);
Route::apiResource('performance',PerformanceController::class);
Route::apiResource('notification',NotificationController::class);
Route::apiResource('message',MessageController::class);
