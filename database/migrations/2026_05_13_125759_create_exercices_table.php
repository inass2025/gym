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
    {Schema::create('exercices', function (Blueprint $table) {
            $table->id();
            $table->string('nom');           // ex: "Développé couché"
            $table->string('muscle');        // ex: "Pectoraux"
            $table->string('materiel');      // ex: "Haltères / Barre"
            $table->string('difficulte');    // "Débutant", "Intermédiaire", "Avancé"
            $table->string('emoji')->nullable(); // 🏋️
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exercices');
    }
};
