<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications'; // ← vérifier le nom exact

    protected $fillable = [
        'adherent_id',
        'message',
        'type',
        'lu',
        'date_envoie',
    ];
}