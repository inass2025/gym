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
        if (!Schema::hasColumn('adherents', 'adresse')) {
            $table->string('adresse')->nullable();
        }
    });
}

public function down(): void
{
    Schema::table('adherents', function (Blueprint $table) {
        $table->dropColumn('adresse');
    });
}
};
