<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
class MessageController extends Controller
{
   public function index($adherent_id, $coach_id) {
        $messages = Message::where('adherent_id', $adherent_id)
                           ->where('coach_id', $coach_id)
                           ->orderBy('date_envoie')
                           ->get();
        return response()->json($messages);
    }

    
    public function store(Request $request) {
    
    Log::info('Request data:', $request->all());

    $message = Message::create([
        'content'     => $request->input('content'),  // ← bdel $request->content
        'date_envoie' => now(),
        'adherent_id' => $request->input('adherent_id'),
        'coach_id'    => $request->input('coach_id'),
    ]);

    return response()->json($message, 201);
}
  
}