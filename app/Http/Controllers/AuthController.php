<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Adherent;
use App\Models\Coach;

class AuthController extends Controller
{
    // ================= REGISTER =================
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
            'date_inscription' => now(),
            'role'             => 'adherent',
        ]);

        $token = $adherent->createToken('adherent-token')->plainTextToken;

        return response()->json([
            'user'  => $adherent,
            'token' => $token,
            'role'  => $adherent->role,
        ], 201);
    }

    // ================= LOGIN =================
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        // Check Adherent
        $adherent = Adherent::where('email', $request->email)->first();
        if ($adherent && Hash::check($request->password, $adherent->password)) {
            $token = $adherent->createToken('adherent-token')->plainTextToken;
            return response()->json([
                'user'  => $adherent,
                'token' => $token,
                'role'  => $adherent->role,
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

        return response()->json([
            'message' => 'Email ou mot de passe incorrect'
        ], 401);
    }

    // ================= LOGOUT =================
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }
}