<?php

namespace App\Http\Controllers;

use App\Models\Paiement;
use Illuminate\Http\Request;

class PaiementController extends Controller
{
    public function index()
    {
        $paiements = Paiement::all();
        return response()->json($paiements, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'montant'        => 'required|numeric',
            'date'           => 'required|date',
            'methode'        => 'required|string',
            'statut'         => 'required|string',
            'adherent_id'    => 'required|exists:adherents,id',
            'abonnement_id'  => 'required|exists:abonnements,id',
        ]);

        $paiement = Paiement::create($request->all());
        return response()->json($paiement, 201);
    }

    public function show($id)
    {
        $paiement = Paiement::find($id);
        if (!$paiement) {
            return response()->json(['message' => 'Paiement introuvable'], 404);
        }
        return response()->json($paiement, 200);
    }

    public function update(Request $request, $id)
    {
        $paiement = Paiement::find($id);
        if (!$paiement) {
            return response()->json(['message' => 'Paiement introuvable'], 404);
        }
        $paiement->update($request->all());
        return response()->json($paiement, 200);
    }

    public function destroy($id)
    {
        $paiement = Paiement::find($id);
        if (!$paiement) {
            return response()->json(['message' => 'Paiement introuvable'], 404);
        }
        $paiement->delete();
        return response()->json(['message' => 'Paiement supprimé'], 200);
    }
}