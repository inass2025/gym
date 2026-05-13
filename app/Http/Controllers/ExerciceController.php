<?php

namespace App\Http\Controllers;

use App\Models\Exercice;
use Illuminate\Http\Request;

class ExerciceController extends Controller
{
    // GET /api/exercices — retourne tous les exercices
    public function index()
    {
        $exercices = Exercice::all();
        return response()->json($exercices);
    }

    // GET /api/exercices/{id} — retourne un seul exercice
    public function show($id)
    {
        $exercice = Exercice::findOrFail($id);
        return response()->json($exercice);
    }

    // POST /api/exercices — crée un nouvel exercice
    public function store(Request $request)
    {
        // Validation des données envoyées
        $request->validate([
            'nom'        => 'required|string',
            'muscle'     => 'required|string',
            'materiel'   => 'required|string',
            'difficulte' => 'required|in:Débutant,Intermédiaire,Avancé',
        ]);

        $exercice = Exercice::create($request->all());
        return response()->json($exercice, 201); // 201 = créé avec succès
    }

    // DELETE /api/exercices/{id} — supprime un exercice
    public function destroy($id)
    {
        Exercice::findOrFail($id)->delete();
        return response()->json(['message' => 'Exercice supprimé']);
    }
}