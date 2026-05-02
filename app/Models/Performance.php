<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Performance extends Model
{
    protected $table = 'performances';

    protected $fillable = [
        'poids',
        'taille',
        'date_suivi',
        'objectif',
        'adherent_id',
    ];


    public function adherent()
    {
        return $this->belongsTo(Adherent::class);
    }
}
