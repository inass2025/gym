<?php

namespace App\Http\Controllers;
use App\Models\Adherent;
use App\Models\Coach;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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

    $data = $request->only([
        'nom', 'prenom', 'email', 
        'telephone', 'specialite', 'bio'
    ]);

    if ($request->hasFile('photo')) {
        if ($coach->photo) {
            \Storage::disk('public')->delete($coach->photo);
        }
        $path = $request->file('photo')->store('photos', 'public');
        $data['photo'] = $path;
    }

    // ← zid hado hnaya
    if ($request->has('certifs')) {
        $data['certifs'] = $request->certifs;
    }
    if ($request->has('experiences')) {
        $data['experiences'] = $request->experiences;
    }

    $coach->update($data); // ← w hna sala
    return response()->json($coach->fresh(), 200);
}


public function changePassword(Request $request, $id)
{
    $request->validate([
        'current_password'      => 'required',
        'new_password'          => 'required|min:6',
        'new_password_confirmation' => 'required|same:new_password',
    ]);

    $coach = Adherent::where('role', 'coach')->findOrFail($id);

    if (!Hash::check($request->current_password, $coach->password)) {
        return response()->json([
            'message' => 'Mot de passe actuel incorrect'
        ], 400);
    }
// changer password
    $coach->update([
        'password' => Hash::make($request->new_password)
    ]);

    return response()->json([
        'message' => 'Mot de passe modifié avec succès'
    ], 200);
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