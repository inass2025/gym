<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens; 
class Coach extends Model
{
    
use HasApiTokens;

protected $table = 'coach';
protected $fillable = [
    'nom',
    'prenom',
    'email',
    'password',
    'specialite',
    'telephone',
];

public function cours(){
    return $this->hasMany(Cours::class);
};

public function message(){
    return hasMany->(Message::class);
};



}

