<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


// database/migrations/create_abonnements_table.php

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('abonnements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('adherent_id')->constrained('adherents')->onDelete('cascade');
            $table->foreignId('type_abonnement_id')->constrained('type_abonnements');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->decimal('prix', 8, 2);
            $table->enum('statut', ['actif', 'suspendu', 'expire', 'renouvele'])
                ->default('actif');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('abonnements');
    }
};