<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    // GET /api/notifications/{adherentId}
    public function index(int $adherentId): JsonResponse
    {
        $notifications = Notification::where('adherent_id', $adherentId)
            ->orderBy('date_envoie', 'desc')
            ->get();

        return response()->json($notifications);
    }

    // PATCH /api/notifications/{id}/lu
    public function markAsRead(int $id): JsonResponse
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['lu' => true]);

        return response()->json(['success' => true]);
    }

    // PATCH /api/notifications/adherent/{adherentId}/lu-tout
    public function markAllAsRead(int $adherentId): JsonResponse
    {
        Notification::where('adherent_id', $adherentId)
            ->where('lu', false)
            ->update(['lu' => true]);

        return response()->json(['success' => true]);
    }
     public function store(Request $request)
    {
        $notif = Notification::create([
            'adherent_id' => $request->adherent_id,
            'message'     => $request->message,
            'type'        => $request->type ?? 'admin',
            'lu'          => false,
            'date_envoie' => now(),
        ]);

        return response()->json([
            'message'      => 'Notification envoyée.',
            'notification' => $notif,
        ], 201);
    }
}