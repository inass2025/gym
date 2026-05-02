<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::all();
        return response()->json($notifications, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'message'     => 'required|string',
            'type'        => 'required|string',
            'adherent_id' => 'required|exists:adherents,id',
        ]);

        $notification = Notification::create($request->all());
        return response()->json($notification, 201);
    }

    public function show($id)
    {
        $notification = Notification::find($id);
        if (!$notification) {
            return response()->json(['message' => 'Notification introuvable'], 404);
        }
        return response()->json($notification, 200);
    }

    public function update(Request $request, $id)
    {
        $notification = Notification::find($id);
        if (!$notification) {
            return response()->json(['message' => 'Notification introuvable'], 404);
        }
        $notification->update($request->all());
        return response()->json($notification, 200);
    }

    public function destroy($id)
    {
        $notification = Notification::find($id);
        if (!$notification) {
            return response()->json(['message' => 'Notification introuvable'], 404);
        }
        $notification->delete();
        return response()->json(['message' => 'Notification supprimée'], 200);
    }
}