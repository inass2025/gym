<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Abonnement extends Model
{
protected $table = 'abonnement';
protected $fillable = [
    'type',
    'date_dèbut',
    'date_fin',
    'prix',
    'statut',
    'adherent_id',

];


public function adherent(){
    return $this->belongsTo(Adherent::class);
};


public function paiement(){
    return $this->hasMany(Paiment::class);
};
}
