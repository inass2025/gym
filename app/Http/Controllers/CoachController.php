<?php

namespace App\Http\Controllers;

use App\Models\Adherent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class CoachController extends Controller
{
    // ✅ 1. LISTE tous les coachs
    public function index()
    {
        try {
            $coachs = Adherent::where('role', 'coach')->get();

            // Ajouter nombre_clients seulement si la colonne coach_id existe
            $coachs = $coachs->map(function ($coach) {
                if (Schema::hasColumn('adherents', 'coach_id')) {
                    $coach->nombre_clients = Adherent::where('coach_id', $coach->id)
                                                     ->where('role', 'adherent')
                                                     ->count();
                } else {
                    $coach->nombre_clients = 0;
                }
                return $coach;
            });

            return response()->json($coachs);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    // ✅ 2. VOIR un coach (profil)
    public function show($id)
    {
        try {
            $coach = Adherent::where('id', $id)->where('role', 'coach')->firstOrFail();

            if (Schema::hasColumn('adherents', 'coach_id')) {
                $coach->nombre_clients = Adherent::where('coach_id', $id)
                                                  ->where('role', 'adherent')
                                                  ->count();
            } else {
                $coach->nombre_clients = 0;
            }

            return response()->json($coach);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Coach non trouvé'], 404);
        }
    }

    // ✅ 3. CRÉER un coach
    public function store(Request $request)
    {
        try {
            $request->validate([
                'nom'              => 'required|string|max:100',
                'prenom'           => 'required|string|max:100',
                'email'            => 'required|email|unique:adherents,email',
                'password'         => 'required|string|min:6',
                'telephone'        => 'nullable|string|max:20',
                'date_inscription' => 'nullable|date',
                'objectif'         => 'nullable|string|max:255',
            ]);

            $coach = Adherent::create([
                'nom'              => $request->nom,
                'prenom'           => $request->prenom,
                'email'            => $request->email,
                'password'         => $request->password,
                'role'             => 'coach',
                'telephone'        => $request->telephone,
                'date_inscription' => $request->date_inscription,
                'objectif'         => $request->objectif,
            ]);

            return response()->json(['message' => 'Coach créé', 'coach' => $coach], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    // ✅ 4. MODIFIER un coach
    public function update(Request $request, $id)
    {
        try {
            $coach = Adherent::where('id', $id)->where('role', 'coach')->firstOrFail();

            $request->validate([
                'nom'              => 'sometimes|string|max:100',
                'prenom'           => 'sometimes|string|max:100',
                'email'            => 'sometimes|email|unique:adherents,email,' . $id,
                'password'         => 'sometimes|string|min:6',
                'telephone'        => 'nullable|string|max:20',
                'date_inscription' => 'nullable|date',
                'objectif'         => 'nullable|string|max:255',
            ]);

            $coach->update($request->only([
                'nom', 'prenom', 'email', 'password',
                'telephone', 'date_inscription', 'objectif',
            ]));

            return response()->json(['message' => 'Coach modifié', 'coach' => $coach]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    // ✅ 5. SUPPRIMER un coach
    public function destroy($id)
    {
        try {
            $coach = Adherent::where('id', $id)->where('role', 'coach')->firstOrFail();
            $coach->delete();
            return response()->json(['message' => 'Coach supprimé']);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Coach non trouvé'], 404);
        }
    }

    // ✅ 6. BLOQUER / DÉBLOQUER (toggle)
    public function toggleBloque($id)
    {
        try {
            $coach = Adherent::where('id', $id)->where('role', 'coach')->firstOrFail();
            $coach->bloque = !$coach->bloque;
            $coach->save();

            $etat = $coach->bloque ? 'bloqué' : 'débloqué';
            return response()->json(['message' => "Coach $etat", 'bloque' => $coach->bloque]);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    // ✅ 7. CLIENTS d'un coach
    public function clients($id)
    {
        try {
            $coach = Adherent::where('id', $id)->where('role', 'coach')->firstOrFail();

            $clients = Schema::hasColumn('adherents', 'coach_id')
                ? Adherent::where('coach_id', $id)
                           ->where('role', 'adherent')
                           ->get(['id', 'nom', 'prenom', 'email', 'telephone', 'objectif'])
                : collect([]);

            return response()->json([
                'coach'   => $coach->prenom . ' ' . $coach->nom,
                'clients' => $clients,
                'total'   => $clients->count(),
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    // ✅ 8. PLANNING d'un coach (ses cours)
    public function planning($id)
    {
        try {
            $coach = Adherent::where('id', $id)->where('role', 'coach')->firstOrFail();

            $cours = Schema::hasTable('cours')
                ? \App\Models\Cours::where('coach_id', $id)->orderBy('horaire')->get()
                : collect([]);

            return response()->json([
                'coach'    => $coach->prenom . ' ' . $coach->nom,
                'planning' => $cours,
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}