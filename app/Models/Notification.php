<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications';

    protected $fillable = [
        'message',
        'date_envoi',
        'type',
        'adherent_id',
    ];


    public function adherent()
    {
        return $this->belongsTo(Adherent::class);
    }
}
