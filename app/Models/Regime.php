<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Regime extends Model
{
    protected $fillable = [
        'adherent_id', 'titre', 'calories',
        'proteines', 'glucides', 'lipides', 'description'
    ];

    public function adherent()
    {
        return $this->belongsTo(Adherent::class);
    }
}