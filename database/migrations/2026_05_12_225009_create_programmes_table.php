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
        Schema::create('programmes', function (Blueprint $table) {
    $table->id();
    $table->string('titre');                              // "Pectoraux & Triceps"
    $table->string('jour');                               // "Lundi"
    $table->text('exercices');                            // "Squat 4x10, Presse 3x12"
    $table->text('conseil')->nullable();                  // conseil du coach
    $table->foreignId('adherent_id')->constrained('adherents');
    $table->foreignId('coach_id')->constrained('adherents');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programmes');
    }
};
