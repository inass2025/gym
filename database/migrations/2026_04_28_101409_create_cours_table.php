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
        Schema::create('cours', function (Blueprint $table) {
    $table->id();
    $table->string('nom');
    $table->text('description')->nullable();  // ← bdlha
    $table->time('heur')->nullable();
    $table->date('date');
    $table->string('capacite');
    $table->string('salle');
    $table->string('niveau')->default('Débutant');  // ← zidha
    $table->string('horaire')->nullable();           // ← zidha
    $table->foreignId('coach_id')->constrained('adherents'); // ← zidha
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cours');
    }
};
