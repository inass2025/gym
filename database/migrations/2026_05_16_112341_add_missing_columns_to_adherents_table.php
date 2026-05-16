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
    Schema::table('adherents', function (Blueprint $table) {
        if (!Schema::hasColumn('adherents', 'date_naissance')) {
            $table->date('date_naissance')->nullable();
        }
        if (!Schema::hasColumn('adherents', 'sexe')) {
            $table->enum('sexe', ['Homme', 'Femme'])->nullable();
        }
        if (!Schema::hasColumn('adherents', 'poids')) {
            $table->decimal('poids', 5, 2)->nullable();
        }
        if (!Schema::hasColumn('adherents', 'taille')) {
            $table->integer('taille')->nullable();
        }
        if (!Schema::hasColumn('adherents', 'niveau')) {
            $table->string('niveau')->nullable();
        }
    });
}

public function down(): void
{
    Schema::table('adherents', function (Blueprint $table) {
        $table->dropColumn(['date_naissance', 'sexe', 'poids', 'taille', 'niveau']);
    });
}
};
