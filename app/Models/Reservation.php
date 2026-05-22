<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $table = 'reservation';

    protected $fillable = [
        'date_reservation',
    'status',
    'adherent_id',
    'cours_id'
    ];


public function adherent()
{
    return $this->belongsTo(Adherent::class);
}

public function cours()
{
    return $this->belongsTo(Cours::class);
}
}


?>
