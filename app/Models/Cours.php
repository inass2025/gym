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
    'salle'

];

public function coach(){
    return $this->belongsTo(Coach::class);
}


public function reservation(){
    return $this->hasMany(Reservation::class);
}
}