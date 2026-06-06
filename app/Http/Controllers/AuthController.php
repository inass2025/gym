<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Adherent;
//  supprime : use App\Models\Coach;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        // On cherche dans UNE seule table : adherents
        // Le role (admin / coach / adherent) est une colonne dans cette table
        $adherent = Adherent::where('email', $request->email)->first();

        if (!$adherent || !Hash::check($request->password, $adherent->password)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
        }

        $token = $adherent->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user'  => $adherent,
            'token' => $token,
            'role'  => $adherent->role, // "admin", "coach", ou "adherent"
        ]);
    }

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

        $token = $adherent->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user'  => $adherent,
            'token' => $token,
            'role'  => $adherent->role,
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }
}