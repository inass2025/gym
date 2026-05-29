<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use App\Models\Adherent;
use Illuminate\Http\Request;

class CoursController extends Controller
{
    public function index()
    {
        return response()->json(
            Cours::with('coach:id,nom,prenom')
                ->withCount('reservation')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom'      => 'required|string|max:255',
            'date'     => 'required|date',
            'heur'     => 'required|date_format:H:i',
            'capacite' => 'required|integer|min:1',
            'salle'    => 'required|string|max:255',
            'coach_id' => 'required|integer|exists:adherents,id',
        ]);

        $cours = Cours::create($validated);
        return response()->json($cours->load('coach:id,nom,prenom'), 201);
    }
public function update(Request $request, $id)
{
    $cours = Cours::findOrFail($id);

    $request->validate([
        'nom'         => 'sometimes|string|max:255',
        'description' => 'nullable|string',
        'date'        => 'sometimes|date',
        'heur'        => 'sometimes|string|max:10',   // 👈 string simple, pas date_format
        'capacite'    => 'sometimes|integer|min:1',
        'salle'       => 'sometimes|string|max:255',
        'coach_id'    => 'sometimes|integer|exists:adherents,id',
    ]);

    $cours->update($request->only([
        'nom', 'description', 'date', 'heur', 'capacite', 'salle', 'coach_id'
    ]));

    return response()->json($cours->load('coach:id,nom,prenom'));
}

    public function destroy($id)
    {
        Cours::findOrFail($id)->delete();
        return response()->json(['message' => 'Cours supprimé avec succès.']);
    }

    public function coachesList()
    {
        return response()->json(
            Adherent::whereIn('role', ['coach', 'admin'])
                ->select('id', 'nom', 'prenom')
                ->get()
        );
    }
}