<?php

namespace App\Http\Controllers;
use App\Models\Adherent;
use App\Models\Coach;
use Illuminate\Http\Request;

class CoachController extends Controller
{
    // GET /api/coach
    public function index()
    {
        $coachs = Coach::all();
        return response()->json($coachs, 200);
    }

    // POST /api/coach
    public function store(Request $request)
    {
        $request->validate([
            'nom'       => 'required|string',
            'prenom'    => 'required|string',
            'email'     => 'required|email|unique:coachs',
            'password'  => 'required|min:6',
            'specialite'=> 'required|string',
        ]);

        $coach = Coach::create([
            'nom'        => $request->nom,
            'prenom'     => $request->prenom,
            'email'      => $request->email,
            'password'   => bcrypt($request->password),
            'specialite' => $request->specialite,
            'telephone'  => $request->telephone,
        ]);

        return response()->json($coach, 201);
    }

    // GET /api/coach/{id}
    public function show($id)
    {
        $coach = Coach::find($id);

        if (!$coach) {
            return response()->json(['message' => 'Coach introuvable'], 404);
        }

        return response()->json($coach, 200);
    }

    // PUT /api/coach/{id}
public function update(Request $request, $id)
{
    $coach = Adherent::findOrFail($id);
    
    $data = $request->only(['nom', 'prenom', 'email', 'telephone', 'specialite']);
    
    if ($request->hasFile('photo')) {
        $path = $request->file('photo')->store('photos', 'public');
        $data['photo'] = $path;
    }
    
    $coach->update($data);
    return response()->json($coach->fresh()); // ← bdl $coach b $coach->fresh()
}

    // DELETE /api/coach/{id}
    public function destroy($id)
    {
        $coach = Coach::find($id);

        if (!$coach) {
            return response()->json(['message' => 'Coach introuvable'], 404);
        }

        $coach->delete();
        return response()->json(['message' => 'Coach supprimé'], 200);
    }
}