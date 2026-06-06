<?php

namespace App\Http\Controllers;

use App\Models\Adherent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AdherentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Adherent::where('role', 'adherent');

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nom',    'like', "%{$search}%")
                  ->orWhere('prenom', 'like', "%{$search}%")
                  ->orWhere('email',  'like', "%{$search}%");
            });
        }

        if ($niveau = $request->get('niveau')) {
            $query->where('niveau', $niveau);
        }

        if ($request->has('bloque')) {
            $query->where('bloque', $request->boolean('bloque'));
        }

        $adherents = $query->orderBy('nom')
                           ->paginate($request->get('per_page', 8));

        return response()->json($adherents);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom'              => 'required|string|max:100',
            'prenom'           => 'required|string|max:100',
            'email'            => 'required|email|unique:adherents,email',
            'password'         => 'required|string|min:6',
            'telephone'        => 'nullable|string|max:20',
            'adresse'          => 'nullable|string|max:255',
            'date_naissance'   => 'nullable|date',
            'sexe'             => 'nullable|in:homme,femme',
            'poids'            => 'nullable|numeric|min:0|max:300',
            'taille'           => 'nullable|numeric|min:0|max:250',
            'date_inscription' => 'nullable|date',
            'objectif'         => 'nullable|string|max:255',
            'niveau'           => 'nullable|in:debutant,intermediaire,avance',
            'photo'            => 'nullable|image|max:2048',
        ]);

        $validated['password']         = Hash::make($validated['password']);
        $validated['role']             = 'adherent';
        $validated['date_inscription'] = $validated['date_inscription'] ?? now()->toDateString();

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('photos', 'public');
        }

        $adherent = Adherent::create($validated);

        return response()->json([
            'message'  => 'Adhérent créé avec succès.',
            'adherent' => $adherent,
        ], 201);
    }

    public function show(Adherent $adherent): JsonResponse
    {
        return response()->json($adherent);
    }

    public function update(Request $request, Adherent $adherent): JsonResponse
    {
        $validated = $request->validate([
            'nom'            => 'required|string|max:100',
            'prenom'         => 'required|string|max:100',
            'email'          => ['required', 'email', Rule::unique('adherents')->ignore($adherent->id)],
            'password'       => 'nullable|string|min:6',
            'telephone'      => 'nullable|string|max:20',
            'adresse'        => 'nullable|string|max:255',
            'date_naissance' => 'nullable|date',
            'sexe'           => 'nullable|in:homme,femme',
            'poids'          => 'nullable|numeric|min:0|max:300',
            'taille'         => 'nullable|numeric|min:0|max:250',
            'objectif'       => 'nullable|string|max:255',
            'niveau'         => 'nullable|in:debutant,intermediaire,avance',
            'photo'          => 'nullable|image|max:2048',
            'bloque'         => 'nullable|boolean',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        if ($request->hasFile('photo')) {
            if ($adherent->photo) {
                Storage::disk('public')->delete($adherent->photo);
            }
            $validated['photo'] = $request->file('photo')->store('photos', 'public');
        }

        $adherent->update($validated);

        return response()->json([
            'message'  => 'Adhérent mis à jour avec succès.',
            'adherent' => $adherent->fresh(),
        ]);
    }

    public function destroy(Adherent $adherent): JsonResponse
    {
        if ($adherent->photo) {
            Storage::disk('public')->delete($adherent->photo);
        }

        $adherent->abonnements()->delete();
        $adherent->reservation()->delete();
        $adherent->performance()->delete();
        $adherent->notification()->delete();
        $adherent->message()->delete();
        $adherent->paiements()->delete();
        \App\Models\Programme::where('adherent_id', $adherent->id)->delete();

        $adherent->delete();

        return response()->json(['message' => 'Adhérent supprimé avec succès.']);
    }

    public function bloquer(Adherent $adherent): JsonResponse
    {
        $adherent->update(['bloque' => !$adherent->bloque]);
        $statut = $adherent->bloque ? 'bloqué' : 'débloqué';

        return response()->json([
            'message'  => "Adhérent {$statut} avec succès.",
            'adherent' => $adherent->fresh(),
        ]);
    }

    public function profil(Adherent $adherent): JsonResponse
    {
        $adherent->loadMissing([
            'abonnement',
            'reservation',
            'performance',
        ]);

        return response()->json([
            'id'               => $adherent->id,
            'nom'              => $adherent->nom,
            'prenom'           => $adherent->prenom,
            'email'            => $adherent->email,
            'telephone'        => $adherent->telephone,
            'adresse'          => $adherent->adresse,
            'date_naissance'   => $adherent->date_naissance,
            'sexe'             => $adherent->sexe,
            'poids'            => $adherent->poids,
            'taille'           => $adherent->taille,
            'date_inscription' => $adherent->date_inscription,
            'objectif'         => $adherent->objectif,
            'niveau'           => $adherent->niveau,
            'bloque'           => $adherent->bloque,
            'photo'            => $adherent->photo ?? null,
            'abonnements'      => $adherent->abonnement,
            'reservations'     => $adherent->reservation,
            'performances'     => $adherent->performance,
        ]);
    }

    // =========================================================
    // GET /api/profile  (Sanctum)
    // =========================================================
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'id'               => $user->id,
            'nom'              => $user->nom,
            'prenom'           => $user->prenom,
            'email'            => $user->email,
            'telephone'        => $user->telephone,
            'adresse'          => $user->adresse,
            'date_naissance'   => $user->date_naissance,
            'sexe'             => $user->sexe,
            'poids'            => $user->poids,
            'taille'           => $user->taille,
            'date_inscription' => $user->date_inscription,
            'objectif'         => $user->objectif,
            'niveau'           => $user->niveau,
            'bloque'           => $user->bloque,
            'role'             => $user->role,
            // ✅ path relatif fqt — mashi full URL
            'photo'            => $user->photo ?? null,
        ]);
    }

    // =========================================================
    // POST /api/profile  (Sanctum) — method spoofing PUT
    // =========================================================
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'nom'            => 'required|string|max:100',
            'prenom'         => 'required|string|max:100',
            'email'          => ['required', 'email', Rule::unique('adherents')->ignore($user->id)],
            'password'       => 'nullable|string|min:6',
            'telephone'      => 'nullable|string|max:20',
            'adresse'        => 'nullable|string|max:255',
            'date_naissance' => 'nullable|date',
            'sexe'           => 'nullable|in:homme,femme',
            'poids'          => 'nullable|numeric|min:0|max:300',
            'taille'         => 'nullable|numeric|min:0|max:250',
            // ✅ string max — yqbal ga3 les valeurs
            'objectif'       => 'nullable|string|max:255',
            'niveau'         => 'nullable|in:debutant,intermediaire,avance',
            'photo'          => 'nullable|image|max:2048',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        // ✅ FIX — photo handling sahih
        if ($request->hasFile('photo')) {
            if ($user->photo) {
                Storage::disk('public')->delete($user->photo);
            }
            $validated['photo'] = $request->file('photo')->store('photos', 'public');
        } else {
            // ✅ mtsadch photo field ila mawjudch fichier
            unset($validated['photo']);
        }

        $user->update($validated);
        $user->refresh();

        return response()->json([
            'message' => 'Profil mis à jour avec succès.',
            'user'    => [
                'id'               => $user->id,
                'nom'              => $user->nom,
                'prenom'           => $user->prenom,
                'email'            => $user->email,
                'telephone'        => $user->telephone,
                'adresse'          => $user->adresse,
                'date_naissance'   => $user->date_naissance,
                'sexe'             => $user->sexe,
                'poids'            => $user->poids,
                'taille'           => $user->taille,
                'date_inscription' => $user->date_inscription,
                'objectif'         => $user->objectif,
                'niveau'           => $user->niveau,
                'role'             => $user->role,
                // ✅ path relatif fqt
                'photo'            => $user->photo ?? null,
            ],
        ]);
    }

    // =========================================================
    // POST /api/profile/photo  (Sanctum)
    // =========================================================
    public function updatePhoto(Request $request): JsonResponse
    {
        $user = $request->user();
        $request->validate(['photo' => 'required|image|max:2048']);

        if ($user->photo) {
            Storage::disk('public')->delete($user->photo);
        }

        $path = $request->file('photo')->store('photos', 'public');
        $user->update(['photo' => $path]);

        return response()->json([
            'message' => 'Photo mise à jour.',
            'photo'   => $path,
        ]);
    }
}