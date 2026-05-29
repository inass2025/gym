<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paiment extends Model
{
    protected $table = 'paiement';

    protected $fillable = [
        'montant',
        'date_paiement',
        'mrthode',        // ✅ khllitha kma hiya
        'statut',
        'adherent_id',
        'abonnement_id',
    ];

    // ✅ Kayna deja
    public function adherent()
    {
        return $this->belongsTo(Adherent::class);
    }

    // ✅ Kayna deja
    public function abonnement()
    {
        return $this->belongsTo(Abonnement::class);
    }

    // ➕ Jdid — scope paiements en retard
    public function scopeEnRetard($query)
    {
        return $query->where('statut', 'retard');
    }

    // ➕ Jdid — total des paiements (statistiques)
    public static function totalRevenus()
    {
        return self::where('statut', 'paye')->sum('montant');
    }

    // ➕ Jdid — revenus par mois
    public static function revenusMois($mois, $annee)
    {
        return self::where('statut', 'paye')
                ->whereMonth('date_paiement', $mois)
                ->whereYear('date_paiement', $annee)
                ->sum('montant');
    }
}