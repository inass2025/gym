<?php

namespace App\Http\Controllers;

use App\Models\Abonnement;
use Illuminate\Http\Request;

class AbonnementController extends Controller
{
public function index(Request $request)
{
    $abonnements = Abonnement::where('adherent_id', $request->user()->id)
        ->orderBy('date_debut', 'asc')
        ->get();

    return response()->json($abonnements);
}

    public function store(Request $request)
    {
        $request->validate([
            'type'  => 'required|string',
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
    public function souscrire(Request $request)
{
    $request->validate([
        'type' => 'required|in:mensuel,trimestriel,annuel'
    ]);

    $prix = match($request->type) {
        'mensuel'      => 199,
        'trimestriel'  => 499,
        'annuel'       => 1499,
    };

    $duree = match($request->type) {
        'mensuel'      => 1,
        'trimestriel'  => 3,
        'annuel'       => 12,
    };

    // إلغاء الأبونمان القديم إذا كان موجود
    Abonnement::where('adherent_id', $request->user()->id)
        ->where('statut', 'actif')
        ->update(['statut' => 'annulé']);

    $abo = Abonnement::create([
        'adherent_id' => $request->user()->id,
        'type'        => $request->type,
        'statut'      => 'actif',
        'prix'        => $prix,
        'date_debut'  => now()->toDateString(),
        'date_fin'    => now()->addMonths($duree)->toDateString(),
    ]);

    return response()->json($abo, 201);
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
    
public function check(Request $request)
{
    $user = $request->user();

    $abonnement = Abonnement::where('adherent_id', $user->id)
        ->where('statut', 'actif')
        ->where('date_fin', '>=', now())
        ->first();

    return response()->json([
        'hasAbonnement' => $abonnement ? true : false
    ]);
}
}