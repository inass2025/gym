<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Adherent extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'adherents';
protected $casts = [
    'certifs'     => 'array',
    'experiences' => 'array',
];
    protected $fillable = [
    'nom',
    'prenom',
    'email',
    'password',
    'telephone',
    'adresse',
    'date_naissance',
    'sexe',
    'poids',
    'taille',
    'date_inscription',
    'objectif',
    'niveau',
    'role',
    'photo',
    'specialite',   // ← zdt
    'bio',          // ← zdt
    'certifs',      // ← zdt
    'experiences',  // ← zdt
];

    protected $hidden = [
        'password',
    ];

    public function reservation()
    {
        return $this->hasMany(Reservation::class);
    }

    public function abonnement()
    {
        return $this->hasMany(Abonnement::class);
    }

    public function performance()
    {
        return $this->hasMany(Performance::class);
    }

    public function message()
    {
        return $this->hasMany(Message::class);
    }

    public function notification()
    {
        return $this->hasMany(Notification::class);
    }
}