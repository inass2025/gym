<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paiment extends Model
{
    protected $table = 'paiement';
    
    protected $fillable = [
        'montant',
        'date_paiement',  // ← بدل 'date'
        'mrthode',        // ← بدل 'methode' (نفس اسم العمود في DB)
        'statut',
        'adherent_id',
        'abonnement_id',
    ];

    public function adherent()
    {
        return $this->belongsTo(Adherent::class);
    }

    public function abonnement()
    {
        return $this->belongsTo(Abonnement::class);
    }
}