<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $table = 'message';

     protected $fillable = [
        'content',      
        'date_envoie',  
        'adherent_id',
        'coach_id',
        //'sender', 
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
