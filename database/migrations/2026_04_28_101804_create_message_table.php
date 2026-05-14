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
    // database/migrations/xxxx_create_messages_table.php
Schema::create('message', function (Blueprint $table) {
    $table->id();
    $table->foreignId('adherent_id')->constrained('adherents')->onDelete('cascade');
    $table->foreignId('receiver_id')->constrained('adherents')->onDelete('cascade'); // ← بدل coach_id
    $table->text('content');
    $table->datetime('date_envoie');
    $table->timestamps();
});
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('message');
    }
};
