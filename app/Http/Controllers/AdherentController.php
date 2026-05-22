<?php

namespace App\Http\Controllers;

use App\Models\Adherent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdherentController extends Controller
{
    /**
     * GET /api/adherent
     */
    public function index(Request $request): JsonResponse
    {
        $query = Adherent::where('role', 'adherent'); // exclure admins/coachs

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

    /**
     * POST /api/adherent
     */
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

    /**
     * GET /api/adherent/{id}
     */
    public function show(Adherent $adherent): JsonResponse
    {
        return response()->json($adherent);
    }

    /**
     * PUT /api/adherent/{id}
     */
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
            $validated['photo'] = $request->file('photo')->store('photos', 'public');
        }

        $adherent->update($validated);

        return response()->json([
            'message'  => 'Adhérent mis à jour avec succès.',
            'adherent' => $adherent->fresh(),
        ]);
    }

    /**
     * DELETE /api/adherent/{id}
     */
    public function destroy(Adherent $adherent): JsonResponse
    {
        $adherent->delete();

        return response()->json(['message' => 'Adhérent supprimé avec succès.']);
    }

    /**
     * GET /api/profile  (utilisateur connecté)
     */
    public function profile(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }
}