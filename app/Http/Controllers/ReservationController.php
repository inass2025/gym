<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
   public function index()
{
    $reservations = Reservation::with('adherent', 'cours')->get();
    return response()->json($reservations, 200);
}

   public function store(Request $request)
{
    $user = $request->user();

    Reservation::create([
        'cours_id' => $request->cours_id,
        'adherent_id' => $user->id,
        'date_reservation' => now(),
        'status' => 'confirmé',
    ]);

    return response()->json(['message' => 'OK']);
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
    $reservations = Reservation::with('cours')          // ← جيب بيانات الكورس
        ->where('adherent_id', $request->user()->id)    // ← ديال المستخدم فقط
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($reservations, 200);
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


public function accepter($id)
{
    $reservation = Reservation::findOrFail($id);
    $reservation->update(['status' => 'accepté']);
    return response()->json($reservation, 200);
}

public function refuser($id)
{
    $reservation = Reservation::findOrFail($id);
    $reservation->update(['status' => 'refusé']);
    return response()->json($reservation, 200);
}

public function destroy( Request $request ,$id)
{
    $reservation = Reservation::where('id', $id)
        ->where('adherent_id', $request->user()->id) 
        ->first();

    if (!$reservation) {
        return response()->json(['message' => 'Réservation introuvable'], 404);
    }

    $reservation->delete();
    return response()->json(['message' => 'Réservation supprimée'], 200);
}
}