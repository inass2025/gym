<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


// database/migrations/create_paiements_table.php

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('adherent_id')->constrained('adherents')->onDelete('cascade');
            $table->foreignId('abonnement_id')->constrained('abonnements')->onDelete('cascade');
            $table->decimal('montant', 8, 2);
            $table->date('date_paiement');
            $table->enum('methode', ['cash', 'carte', 'virement'])->default('cash');
            $table->enum('statut', ['paye', 'en_attente', 'retard'])->default('paye');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};