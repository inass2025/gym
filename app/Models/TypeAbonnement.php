<?php
// app/Models/TypeAbonnement.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypeAbonnement extends Model
{
    protected $table = 'type_abonnements';

    protected $fillable = [
        'nom',
        'prix',
        'duree_jours',
        'actif'
    ];

    // TypeAbonnement 3ndo bzaf abonnements
    public function abonnements()
    {
        return $this->hasMany(Abonnement::class);
    }
}