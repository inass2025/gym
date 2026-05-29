<?php
// database/migrations/create_type_abonnements_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('type_abonnements', function (Blueprint $table) {
            $table->id();
            $table->string('nom');           // "Mensuel", "Trimestriel", "Annuel"
            $table->decimal('prix', 8, 2);   // Prix de base
            $table->integer('duree_jours');  // 30, 90, 365
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('type_abonnements');
    }
};