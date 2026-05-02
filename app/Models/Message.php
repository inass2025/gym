<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $table = 'messages';

    protected $fillable = [
        'contenu',
        'date_envoi',
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
