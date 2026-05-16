<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Programme extends Model
{
    protected $fillable = [
        'titre', 'jour', 'exercices', 
        'conseil', 'adherent_id', 'coach_id'
    ];

    public function adherent()
    {
        return $this->belongsTo(Adherent::class);
    }

    public function coach()
    {
        return $this->belongsTo(Adherent::class, 'coach_id');
    }
}