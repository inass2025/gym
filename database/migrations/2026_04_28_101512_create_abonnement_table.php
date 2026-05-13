<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('abonnement', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->date('date_debut');
            $table->foreignId('adherent_id')->constrained('adherents');
            $table->date('date_fin');
            $table->string('prix');
            $table->string('statut');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('abonnement');
    }
};
