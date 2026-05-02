<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

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


    public function update(Request $request, $id)
    {
        $adherent = Adherent::find($id);

        if (!$adherent) {
            return response()->json([
                'message' => 'Introuvable'
            ], 404);
        }

        $adherent->update($request->all());
        return response()->json($adherent, 200);
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