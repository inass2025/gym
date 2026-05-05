<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
       Schema::table('users', function (Blueprint $table) {
        $table->enum('role', ['admin', 'coach', 'adherent'])
              ->default('adherent');
    });
    }

    public function down(): void
    {
        Schema::table('adherents', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};