<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Abonnement extends Model
{
    protected $table = 'abonnement';
    
    protected $fillable = [
        'type',
        'date_debut',
        'date_fin',
        'prix',
        'statut',
        'adherent_id',
        
    ];

    // ✅ Kayna deja
    public function adherent()
    {
        return $this->belongsTo(Adherent::class);
    }

    // ✅ Kayna deja (khllitha kma hiya)
    public function paiement()
    {
        return $this->hasMany(Paiment::class);
    }

    // ➕ Jdid — wach expire?
    public function estExpire(): bool
    {
        return Carbon::now()->isAfter($this->date_fin);
    }

    // ➕ Jdid — kddach jao f jours
    public function joursRestants(): int
    {
        return max(0, Carbon::now()->diffInDays($this->date_fin, false));
    }

    // ➕ Jdid — scope les abonnements actifs
    public function scopeActif($query)
    {
        return $query->where('statut', 'actif');
    }

    // ➕ Jdid — scope les abonnements expires
    public function scopeExpire($query)
    {
        return $query->where('statut', 'expire');
    }

    // ➕ Jdid — scope li ghadi yexpiro f 7 jours
    public function scopeExpirationProche($query)
    {
        return $query->where('statut', 'actif')
                    ->whereBetween('date_fin', [
                        Carbon::now(),
                        Carbon::now()->addDays(7)
                    ]);
    }
}