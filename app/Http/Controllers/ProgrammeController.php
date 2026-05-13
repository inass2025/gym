<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use App\Models\Programme;
class ProgrammeController extends Controller
{
    
        // Pour l'instant on retourne des données fixes
        // Plus tard tu les mettras en base de données
         public function monProgramme()
    {
        // L'adhérent connecté
        $adherent = Auth::user();

        // Ses programmes avec le nom du coach
        $programmes = Programme::with('coach')
                        ->where('adherent_id', $adherent->id)
                        ->get();

        return response()->json([
            'adherent'   => [
                'nom'      => $adherent->nom,
                'prenom'   => $adherent->prenom,
                'objectif' => $adherent->objectif,
            ],
            'programmes' => $programmes,
        ]);
    }
    
}