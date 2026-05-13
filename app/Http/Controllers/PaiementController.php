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
    $paiment = Paiment::create($request->all());
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
}