<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index()
    {
        $reservations = Reservation::all();
        return response()->json($reservations, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'date'        => 'required|date',
            'statut'      => 'required|string',
            'adherent_id' => 'required|exists:adherents,id',
            'cours_id'    => 'required|exists:cours,id',
        ]);

        $reservation = Reservation::create($request->all());
        return response()->json($reservation, 201);
    }

    public function show($id)
    {
        $reservation = Reservation::find($id);
        if (!$reservation) {
            return response()->json(['message' => 'Réservation introuvable'], 404);
        }
        return response()->json($reservation, 200);
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

    public function destroy($id)
    {
        $reservation = Reservation::find($id);
        if (!$reservation) {
            return response()->json(['message' => 'Réservation introuvable'], 404);
        }
        $reservation->delete();
        return response()->json(['message' => 'Réservation supprimée'], 200);
    }
}