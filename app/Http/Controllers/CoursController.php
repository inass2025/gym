<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use Illuminate\Http\Request;

class CoursController extends Controller
{
    public function index()
    {
        $cours = Cours::all();
        return response()->json($cours, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'        => 'required|string',
            'description'=> 'required|string',
            'capacite'   => 'required|integer',
            'salle'      => 'required|string',
            'date'       => 'required|date',
           'coach_id'    => 'required|exists:adherents,id'
        ]);

        $cours = Cours::create($request->all());
        return response()->json($cours, 201);
    }

    public function show($id)
    {
        $cours = Cours::find($id);
        if (!$cours) {
            return response()->json(['message' => 'Cours introuvable'], 404);
        }
        return response()->json($cours, 200);
    }

    public function update(Request $request, $id)
    {
        $cours = Cours::find($id);
        if (!$cours) {
            return response()->json(['message' => 'Cours introuvable'], 404);
        }
        $cours->update($request->all());
        return response()->json($cours, 200);
    }

    public function destroy($id)
    {
        $cours = Cours::find($id);
        if (!$cours) {
            return response()->json(['message' => 'Cours introuvable'], 404);
        }
        $cours->delete();
        return response()->json(['message' => 'Cours supprimé'], 200);
    }
}