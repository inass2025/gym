<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cours extends Model
{
    protected $table = 'cours';
    
    protected $fillable = [
        'nom',
        'description',
        'heur',
        'date',
        'capacite',
        'salle',
        'coach_id', // ✅ ajouté
    ];

    // ✅ coach = adherent avec role "coach"
    public function coach()
    {
        return $this->belongsTo(Adherent::class, 'coach_id');
    }

    public function reservation()
    {
        return $this->hasMany(Reservation::class);
    }
}