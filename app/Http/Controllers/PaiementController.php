<?php

namespace App\Http\Controllers;

use App\Models\Paiment;
use Illuminate\Http\Request;

class PaiementController extends Controller
{
    public function index()
    {
        $paiements = Paiment::all();
        return response()->json($paiements, 200);
    }



public function store(Request $request)
{
    $data = $request->validate([
        'montant'       => 'required|numeric',
        'date_paiement' => 'required|date',
        'statut'        => 'required|string',
        'adherent_id'   => 'required',
        'abonnement_id' => 'nullable',
        'methode'       => 'nullable|string',  // ← nullable
    ]);

    // default value إلا ماجاتش
    $data['methode'] = $data['methode'] ?? 'carte';

    $paiment = Paiment::create($data);
    return response()->json($paiment, 201);
}
    public function show($id)
    {
        $paiement = Paiment::find($id);
        if (!$paiement) {
            return response()->json(['message' => 'Paiement introuvable'], 404);
        }
        return response()->json($paiement, 200);
    }

    public function update(Request $request, $id)
    {
        $paiement = Paiment::find($id);
        if (!$paiement) {
            return response()->json(['message' => 'Paiement introuvable'], 404);
        }
        $paiement->update($request->all());
        return response()->json($paiement, 200);
    }

    public function destroy($id)
    {
        $paiement = Paiment::find($id);
        if (!$paiement) {
            return response()->json(['message' => 'Paiement introuvable'], 404);
        }
        $paiement->delete();
        return response()->json(['message' => 'Paiement supprimé'], 200);
    }



// ✅ Paiements en retard
public function enRetard()
{
    $paiements = Paiment::where('statut', 'retard')
                ->with(['adherent', 'abonnement'])
                ->get();

    return response()->json($paiements);
}

// ✅ Statistiques revenus
public function statistiques()
{
    return response()->json([
        'total_revenus'       => Paiment::where('statut', 'paye')->sum('montant'),
        'revenus_ce_mois'     => Paiment::where('statut', 'paye')
                                    ->whereMonth('date_paiement', now()->month)
                                    ->whereYear('date_paiement', now()->year)
                                    ->sum('montant'),
        'paiements_en_retard' => Paiment::where('statut', 'retard')->count(),
        'total_paiements'     => Paiment::count(),
    ]);
}

// ✅ Historique paiements dyal adherent
public function historique($adherent_id)
{
    $paiements = Paiment::where('adherent_id', $adherent_id)
                ->with('abonnement')
                ->orderBy('date_paiement', 'desc')
                ->get();

    return response()->json($paiements);
}
}