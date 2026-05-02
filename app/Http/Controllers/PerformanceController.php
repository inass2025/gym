<?php

namespace App\Http\Controllers;

use App\Models\Performance;
use Illuminate\Http\Request;

class PerformanceController extends Controller
{
    public function index()
    {
        $performances = Performance::all();
        return response()->json($performances, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'poids'       => 'required|numeric',
            'taille'      => 'required|numeric',
            'date_suivi'  => 'required|date',
            'objectif'    => 'required|string',
            'adherent_id' => 'required|exists:adherents,id',
        ]);

        $performance = Performance::create($request->all());
        return response()->json($performance, 201);
    }

    public function show($id)
    {
        $performance = Performance::find($id);
        if (!$performance) {
            return response()->json(['message' => 'Performance introuvable'], 404);
        }
        return response()->json($performance, 200);
    }

    public function update(Request $request, $id)
    {
        $performance = Performance::find($id);
        if (!$performance) {
            return response()->json(['message' => 'Performance introuvable'], 404);
        }
        $performance->update($request->all());
        return response()->json($performance, 200);
    }

    public function destroy($id)
    {
        $performance = Performance::find($id);
        if (!$performance) {
            return response()->json(['message' => 'Performance introuvable'], 404);
        }
        $performance->delete();
        return response()->json(['message' => 'Performance supprimée'], 200);
    }
}