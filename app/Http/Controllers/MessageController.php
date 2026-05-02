<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::all();
        return response()->json($messages, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'contenu'     => 'required|string',
            'adherent_id' => 'required|exists:adherents,id',
            'coach_id'    => 'required|exists:coachs,id',
        ]);

        $message = Message::create($request->all());
        return response()->json($message, 201);
    }

    public function show($id)
    {
        $message = Message::find($id);
        if (!$message) {
            return response()->json(['message' => 'Message introuvable'], 404);
        }
        return response()->json($message, 200);
    }

    public function update(Request $request, $id)
    {
        $message = Message::find($id);
        if (!$message) {
            return response()->json(['message' => 'Message introuvable'], 404);
        }
        $message->update($request->all());
        return response()->json($message, 200);
    }

    public function destroy($id)
    {
        $message = Message::find($id);
        if (!$message) {
            return response()->json(['message' => 'Message introuvable'], 404);
        }
        $message->delete();
        return response()->json(['message' => 'Message supprimé'], 200);
    }
}