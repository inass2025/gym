<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('message', function (Blueprint $table) {
            if (!Schema::hasColumn('message', 'receiver_id')) {
                $table->unsignedBigInteger('receiver_id')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('message', function (Blueprint $table) {
            if (Schema::hasColumn('message', 'receiver_id')) {
                $table->dropColumn('receiver_id');
            }
        });
    }
};