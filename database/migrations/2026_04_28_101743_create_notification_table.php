<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->text('message');
            $table->timestamp('date_envoie')->useCurrent();
            $table->enum('type', [
                'abonnement_expire',
                'reservation_confirmee',
                'paiement_confirme',
                'reservation_annulee',
                'rappel_seance',
            ]);
            $table->boolean('lu')->default(false);
            $table->timestamps();

            $table->foreignId('adherent_id')
                  ->constrained('adherents')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};