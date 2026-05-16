<?php
namespace App\Http\Controllers;

use App\Models\Regime;
use Illuminate\Http\Request;

class RegimeController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'adherent_id' => 'required|exists:adherents,id',
            'titre'       => 'required|string',
        ]);

        $regime = Regime::create($request->only([
            'adherent_id', 'titre', 'calories',
            'proteines', 'glucides', 'lipides', 'description'
        ]));

        return response()->json($regime, 201);
    }

    public function index(Request $request)
    {
        $regimes = Regime::where('adherent_id', $request->adherent_id)->get();
        return response()->json($regimes, 200);
    }

    public function destroy($id)
    {
        Regime::findOrFail($id)->delete();
        return response()->json(['message' => 'Régime supprimé'], 200);
    }
}