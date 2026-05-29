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



// ✅ Suspendre abonnement
public function suspendre($id)
{
    $abonnement = Abonnement::find($id);
    if (!$abonnement) {
        return response()->json(['message' => 'Abonnement introuvable'], 404);
    }

    $abonnement->update(['statut' => 'suspendu']);

    return response()->json([
        'message'    => 'Abonnement suspendu',
        'abonnement' => $abonnement
    ]);
}

// ✅ Renouveler abonnement
public function renouveler(Request $request, $id)
{
    $abonnement = Abonnement::find($id);
    if (!$abonnement) {
        return response()->json(['message' => 'Abonnement introuvable'], 404);
    }

    $request->validate([
        'duree_mois' => 'required|integer|min:1',
    ]);

    $abonnement->update([
        'date_fin' => \Carbon\Carbon::parse($abonnement->date_fin)
                        ->addMonths($request->duree_mois),
        'statut'   => 'actif',
    ]);

    return response()->json([
        'message'    => 'Abonnement renouvelé',
        'abonnement' => $abonnement
    ]);
}

// ✅ Historique abonnements dyal adherent
public function historique($adherent_id)
{
    $abonnements = Abonnement::where('adherent_id', $adherent_id)
                    ->with('adherent')
                    ->orderBy('date_debut', 'desc')
                    ->get();

    return response()->json($abonnements);
}

// ✅ Abonnements li ghadi yexpiro f 7 jours
public function expirationProche()
{
    $abonnements = Abonnement::where('statut', 'actif')
                    ->whereBetween('date_fin', [
                        now(),
                        now()->addDays(7)
                    ])
                    ->with('adherent')
                    ->get()
                    ->map(function ($abonnement) {
                        return [
                            'id'             => $abonnement->id,
                            'adherent'       => $abonnement->adherent->nom ?? '',
                            'date_fin'       => $abonnement->date_fin,
                            'jours_restants' => now()->diffInDays($abonnement->date_fin),
                        ];
                    });

    return response()->json($abonnements);
}

// ✅ Expiration automatique
public function expireAutomatique()
{
    $count = Abonnement::where('statut', 'actif')
                ->where('date_fin', '<', now())
                ->update(['statut' => 'expire']);

    return response()->json([
        'message' => "$count abonnements expirés automatiquement"
    ]);
}


// ✅ Method dyal admin — jawb KOLHOM
public function all()
{
    $abonnements = Abonnement::with('adherent')->latest()->get();
    return response()->json($abonnements);
}
}