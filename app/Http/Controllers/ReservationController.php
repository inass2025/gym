<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Cours;
use App\Models\Abonnement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    // ✅ index — with adherent w cours populated
    public function index()
    {
        $reservations = Reservation::with([
            'adherent:id,nom,prenom,email,photo,telephone',
            'cours:id,nom,date,heur,salle,capacite,niveau,coach_id'
        ])->get();

        return response()->json($reservations, 200);
    }

    public function store(Request $request)
    {
        $user    = $request->user();
        $coursId = $request->cours_id;
        $cours   = Cours::findOrFail($coursId);

        if ($cours->capacite <= 0) {
            return response()->json([
                'message' => 'Ce cours est complet, aucune place disponible.'
            ], 422);
        }

        $dejaReserve = Reservation::where('adherent_id', $user->id)
            ->where('cours_id', $coursId)
            ->where('status', 'confirmé')
            ->exists();

        if ($dejaReserve) {
            return response()->json([
                'message' => 'Vous avez déjà réservé ce cours.'
            ], 422);
        }

        DB::transaction(function () use ($user, $cours) {
            Reservation::create([
                'cours_id'         => $cours->id,
                'adherent_id'      => $user->id,
                'date_reservation' => now(),
                'status'           => 'confirmé',
            ]);
            $cours->decrement('capacite');
        });

        return response()->json(['message' => 'Réservation confirmée !'], 201);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();

        $reservation = Reservation::where('id', $id)
            ->where('adherent_id', $user->id)
            ->first();

        if (!$reservation) {
            return response()->json(['message' => 'Réservation introuvable'], 404);
        }

        return response()->json($reservation, 200);
    }

    public function myReservations(Request $request)
    {
        $reservations = Reservation::with('cours')
            ->where('adherent_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reservations, 200);
    }

    public function checkAbonnement(Request $request)
    {
        $hasAbonnement = Abonnement::where('adherent_id', $request->user()->id)
            ->where('statut', 'actif')
            ->where('date_fin', '>=', now())
            ->exists();

        return response()->json(['hasAbonnement' => $hasAbonnement]);
    }

    // ✅ accepter
    public function accepter($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->update(['status' => 'accepté']);
        return response()->json(['message' => 'Réservation acceptée'], 200);
    }

    // ✅ refuser
    public function refuser($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->update(['status' => 'refusé']);
        return response()->json(['message' => 'Réservation refusée'], 200);
    }

    public function update(Request $request, $id)
    {
        $reservation = Reservation::find($id);
        if (!$reservation) {
            return response()->json(['message' => 'Réservation introuvable'], 404);
        }
        $reservation->update($request->all());
        return response()->json($reservation, 200);
    }

    // ✅ destroy — knat naksa
    public function destroy(Request $request, $id)
    {
        $reservation = Reservation::where('id', $id)
            ->where('adherent_id', $request->user()->id)
            ->first();

        if (!$reservation) {
            return response()->json(['message' => 'Réservation introuvable'], 404);
        }

        $reservation->delete();
        return response()->json(['message' => 'Réservation annulée'], 200);
    }
}