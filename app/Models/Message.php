<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $table = 'message';

     protected $fillable = [
        'content',      // ← sah (machi contenu)
        'date_envoie',  // ← sah (machi date_envoi)
        'adherent_id',
        'coach_id',
    ];


    public function adherent()
    {
        return $this->belongsTo(Adherent::class);
    }


    public function coach()
    {
        return $this->belongsTo(Coach::class);
    }
}
