<?php

namespace App\Http\Controllers;

use App\Models\Abonnement;
use Illuminate\Http\Request;

class AbonnementController extends Controller
{
    public function index()
    {
        $abonnements = Abonnement::all();
        return response()->json($abonnements, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type_choix'  => 'required|string',
            'date_debut'  => 'required|date',
            'date_fin'    => 'required|date',
            'prix'        => 'required|numeric',
            'statut'      => 'required|string',
            'adherent_id' => 'required|exists:adherents,id',
        ]);

        $abonnement = Abonnement::create($request->all());
        return response()->json($abonnement, 201);
    }

    public function show($id)
    {
        $abonnement = Abonnement::find($id);
        if (!$abonnement) {
            return response()->json(['message' => 'Abonnement introuvable'], 404);
        }
        return response()->json($abonnement, 200);
    }

    public function update(Request $request, $id)
    {
        $abonnement = Abonnement::find($id);
        if (!$abonnement) {
            return response()->json(['message' => 'Abonnement introuvable'], 404);
        }
        $abonnement->update($request->all());
        return response()->json($abonnement, 200);
    }

    public function destroy($id)
    {
        $abonnement = Abonnement::find($id);
        if (!$abonnement) {
            return response()->json(['message' => 'Abonnement introuvable'], 404);
        }
        $abonnement->delete();
        return response()->json(['message' => 'Abonnement supprimé'], 200);
    }
}