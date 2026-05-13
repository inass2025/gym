<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Programme extends Model
{
    protected $fillable = [
        'titre', 'jour', 'exercices', 'conseil',
        'adherent_id', 'coach_id'
    ];

    // Un programme appartient à un coach
    public function coach()
    {
        return $this->belongsTo(Adherent::class, 'coach_id');
    }
}
