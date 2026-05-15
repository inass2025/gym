<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use App\Models\Programme;
use Illuminate\Http\Request;

class ProgrammeController extends Controller
{
    // Adherent ychof programme dyalu
    public function monProgramme()
    {
        $adherent = Auth::user();
        $programmes = Programme::with('coach')
                        ->where('adherent_id', $adherent->id)
                        ->get();
        return response()->json([
            'adherent' => [
                'nom'      => $adherent->nom,
                'prenom'   => $adherent->prenom,
                'objectif' => $adherent->objectif,
            ],
            'programmes' => $programmes,
        ]);
    }

    // Coach ychof kol programmes li 3ta
    public function index(Request $request)
    {
        $programmes = Programme::with('adherent')
                        ->where('coach_id', $request->user()->id)
                        ->get();
        return response()->json($programmes);
    }

    // Coach yzid programme l adherent
    public function store(Request $request)
    {
        $request->validate([
            'titre'       => 'required|string',
            'jour'        => 'required|string',
            'exercices'   => 'required|string',
            'adherent_id' => 'required|exists:adherents,id',
        ]);

        $programme = Programme::create([
            'titre'       => $request->titre,
            'jour'        => $request->jour,
            'exercices'   => $request->exercices,
            'conseil'     => $request->conseil,
            'adherent_id' => $request->adherent_id,
            'coach_id'    => $request->user()->id,
        ]);

        return response()->json($programme, 201);
    }

    // Coach ymso programme
    public function destroy($id)
    {
        $programme = Programme::where('id', $id)
                        ->where('coach_id', Auth::id())
                        ->firstOrFail();
        $programme->delete();
        return response()->json(['message' => 'Programme supprimé']);
    }
}