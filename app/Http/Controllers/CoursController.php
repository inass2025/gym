<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use Illuminate\Http\Request;

class CoursController extends Controller
{
    public function index()
    {
        return response()->json(Cours::with('coach:id,nom,prenom')->withCount('reservation')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'      => 'required|string',
            'date'     => 'required|date',
            'heur'     => 'required',
            'capacite' => 'required|integer',
            'salle'    => 'required|string',
            'coach_id' => 'required|exists:adherents,id',
        ]);

        $cours = Cours::create($request->all());
        return response()->json($cours, 201);
    }

    public function update(Request $request, $id)
    {
        $cours = Cours::findOrFail($id);
        $cours->update($request->all());
        return response()->json($cours);
    }

    public function destroy($id)
    {
        Cours::findOrFail($id)->delete();
        return response()->json(['message' => 'Supprimé']);
    }

    public function coachesList()
    {
        return response()->json(
            \App\Models\Adherent::whereIn('role', ['coach', 'admin'])
                ->select('id', 'nom', 'prenom')->get()
        );
    }
}