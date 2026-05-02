<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Adherent extends Model
{
    use HasApiTokens;

    protected $table = 'adherents';

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'telephone',
        'date_inscription',
        'objectif',
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