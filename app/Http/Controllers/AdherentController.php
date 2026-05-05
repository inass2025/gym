<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Adherent;
use Illuminate\Support\Facades\Auth;
class AdherentController extends Controller
{

    public function index()
    {
        $adherents = Adherent::all();
        // ola avec relations:
        // $adherents = Adherent::with('reservations')->get();
        
        return response()->json($adherents, 200);
    }


    public function store(Request $request)
    {
    
        $request->validate([
            'nom'   => 'required|string|max:255',
            'email' => 'required|email|unique:adherents',
            'password' => 'required|min:6',
        ]);

    
        $adherent = Adherent::create([
            'nom'      => $request->nom,
            'email'    => $request->email,
            'password' => bcrypt($request->password),
        ]);

        // 3. Return
        return response()->json($adherent, 201);
    }


    public function show($id)
    {
        $adherent = Adherent::find($id);

        if (!$adherent) {
            return response()->json([
                'message' => 'Introuvable'
            ], 404);
        }

        return response()->json($adherent, 200);
    }


    public function update(Request $request)
{
    $user = $request->user();

    $validated = $request->validate([
        'nom'       => 'sometimes|string|max:255',
        'email'     => 'sometimes|email|unique:users,email,' . $user->id,
        'telephone' => 'sometimes|nullable|string|max:20',
        'adresse'   => 'sometimes|nullable|string|max:500',
    ]);

    $user->update($validated);

    return response()->json($user);
}
     
   public function profile()
{
    $user = Auth::user();
    return response()->json($user);
}

    public function destroy($id)
    {
        $adherent = Adherent::find($id);

        if (!$adherent) {
            return response()->json([
                'message' => 'Introuvable'
            ], 404);
        }

        $adherent->delete();
        return response()->json([
            'message' => 'Supprimé avec succès'
        ], 200);
    }
}