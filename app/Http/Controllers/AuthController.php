<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Adherent;
use App\Models\Coach;

class AuthController extends Controller
{
    // POST /api/register - Adhérent
    public function registerAdherent(Request $request)
    {
        $request->validate([
            'nom'      => 'required|string',
            'prenom'   => 'required|string',
            'email'    => 'required|email|unique:adherents',
            'password' => 'required|min:6',
        ]);

        $adherent = Adherent::create([
            'nom'              => $request->nom,
            'prenom'           => $request->prenom,
            'email'            => $request->email,
            'password'         => Hash::make($request->password),
            'telephone'        => $request->telephone,
            'date_inscription' => now(),
            'objectif'         => $request->objectif,
        ]);

        $token = $adherent->createToken('adherent-token')->plainTextToken;

        return response()->json([
            'user'  => $adherent,
            'token' => $token,
        ], 201);
    }

    // POST /api/register-coach - Coach
    public function registerCoach(Request $request)
    {
        $request->validate([
            'nom'        => 'required|string',
            'prenom'     => 'required|string',
            'email'      => 'required|email|unique:coachs',
            'password'   => 'required|min:6',
            'specialite' => 'required|string',
        ]);

        $coach = Coach::create([
            'nom'        => $request->nom,
            'prenom'     => $request->prenom,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'specialite' => $request->specialite,
            'telephone'  => $request->telephone,
        ]);

        $token = $coach->createToken('coach-token')->plainTextToken;

        return response()->json([
            'user'  => $coach,
            'token' => $token,
        ], 201);
    }

    // POST /api/login
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        // Check Adhérent d'abord
        $adherent = Adherent::where('email', $request->email)->first();
        if ($adherent && Hash::check($request->password, $adherent->password)) {
            $token = $adherent->createToken('adherent-token')->plainTextToken;
            return response()->json([
                'user'  => $adherent,
                'token' => $token,
                'role'  => 'adherent',
            ]);
        }

        // Check Coach
        $coach = Coach::where('email', $request->email)->first();
        if ($coach && Hash::check($request->password, $coach->password)) {
            $token = $coach->createToken('coach-token')->plainTextToken;
            return response()->json([
                'user'  => $coach,
                'token' => $token,
                'role'  => 'coach',
            ]);
        }

        return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
    }

    // POST /api/logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }
}