<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exercice extends Model
{
     protected $fillable = [
        'nom',
        'muscle',
        'materiel',
        'difficulte',
        'emoji',
        'description',
    ];
}
