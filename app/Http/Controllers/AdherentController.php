<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Adherent;

class AdherentController extends Controller
{
    // ─── Liste tous les adhérents ─────────────────────────────────────────
    public function index()
{
    $adherents = \App\Models\Adherent::all();
    return response()->json($adherents);
}

// أو زيد route جديد للـ coaches فقط

    // ─── Créer un nouvel adhérent (inscription) ───────────────────────────
    public function store(Request $request)
    {
        $request->validate([
            'nom'      => 'required|string|max:255',
            'prenom'   => 'required|string|max:255',
            'email'    => 'required|email|unique:adherents',
            'password' => 'required|min:6',
        ]);

        $adherent = Adherent::create([
            'nom'              => $request->nom,
            'prenom'           => $request->prenom,
            'email'            => $request->email,
            'password'         => bcrypt($request->password),
            'date_inscription' => now()->toDateString(),
        ]);

        return response()->json($adherent, 201);
    }

    // ─── Afficher un adhérent par ID ──────────────────────────────────────
    public function show($id)
    {
        $adherent = Adherent::find($id);

        if (!$adherent) {
            return response()->json(['message' => 'Introuvable'], 404);
        }

        return response()->json($adherent, 200);
    }

    // ─── Retourner le profil de l'utilisateur connecté ───────────────────
    

    // ─── Mettre à jour le profil complet ─────────────────────────────────
     public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:adherents,email,' . $user->id,
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:500',
            'date_naissance' => 'nullable|date',
            'sexe' => 'nullable|in:Homme,Femme',
            'poids' => 'nullable|numeric',
            'taille' => 'nullable|integer',
            'objectif' => 'nullable|string',
            'niveau' => 'nullable|string',
        ]);

        // update normal fields
        $user->fill($validated);

        // upload photo
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('profiles', 'public');
            $user->photo = $path;
        }

        $user->save();

        return response()->json($user);
    }

    // ─── Changer le mot de passe ──────────────────────────────────────────
    public function changePassword(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'ancien'    => 'required|string',
            'nouveau'   => 'required|string|min:6',
            'confirmer' => 'required|same:nouveau',
        ]);

        if (!Hash::check($request->ancien, $user->password)) {
            return response()->json(['message' => 'Ancien mot de passe incorrect.'], 422);
        }

        $user->update(['password' => bcrypt($request->nouveau)]);

        return response()->json(['message' => 'Mot de passe mis à jour avec succès.'], 200);
    }

    // ─── Supprimer un adhérent ────────────────────────────────────────────
    public function destroy($id)
    {
        $adherent = Adherent::find($id);

        if (!$adherent) {
            return response()->json(['message' => 'Introuvable'], 404);
        }

        $adherent->delete();
        return response()->json(['message' => 'Supprimé avec succès'], 200);
    }
}