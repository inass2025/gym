<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Performance;

class PerformanceController extends Controller
{
    public function index(Request $request)
    {
        $perfs = Performance::where('adherent_id', $request->user()->id)
            ->orderBy('date_suivi', 'asc')
            ->get();
        return response()->json($perfs);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'poids'      => 'required|numeric',
            'taille'     => 'required|numeric',
            'date_suivi' => 'required|date',
            'objectif'   => 'nullable|numeric',
        ]);

        $data['adherent_id'] = $request->user()->id;

        $perf = Performance::create($data);
        return response()->json($perf, 201);
    }

    public function destroy(Request $request, $id)
    {
        $perf = Performance::where('id', $id)
            ->where('adherent_id', $request->user()->id)
            ->firstOrFail();
        $perf->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}