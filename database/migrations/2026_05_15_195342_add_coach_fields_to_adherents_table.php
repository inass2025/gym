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
        // Zid specialite ila ma kaynach
        if (!Schema::hasColumn('adherents', 'specialite')) {
            $table->string('specialite')->nullable();
        }
        // Zid bio ila ma kaynach
        if (!Schema::hasColumn('adherents', 'bio')) {
            $table->text('bio')->nullable();
        }
        // Zid photo ila ma kaynach
        if (!Schema::hasColumn('adherents', 'photo')) {
            $table->string('photo')->nullable();
        }
    });
}

public function down(): void
{
    Schema::table('adherents', function (Blueprint $table) {
        $table->dropColumn(
            array_filter(
                ['specialite', 'bio', 'photo'],
                fn($col) => Schema::hasColumn('adherents', $col)
            )
        );
    });
}
};



