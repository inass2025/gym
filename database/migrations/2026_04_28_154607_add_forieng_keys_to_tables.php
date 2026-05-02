<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Zid coach_id f cours
        Schema::table('cours', function (Blueprint $table) {
            $table->foreignId('coach_id')->constrained('coachs')->onDelete('cascade');
        });

        // Zid adherent_id f abonnements
        Schema::table('abonnement', function (Blueprint $table) {
            $table->foreignId('adherent_id')->constrained('adherents')->onDelete('cascade');
        });

        // Zid adherent_id + cours_id f reservations
        Schema::table('reservation', function (Blueprint $table) {
            $table->foreignId('adherent_id')->constrained('adherents')->onDelete('cascade');
            $table->foreignId('cours_id')->constrained('cours')->onDelete('cascade');
        });

        // Zid adherent_id + abonnement_id f paiements
        Schema::table('paiement', function (Blueprint $table) {
            $table->foreignId('adherent_id')->constrained('adherents')->onDelete('cascade');
            $table->foreignId('abonnement_id')->constrained('abonnement')->onDelete('cascade');
        });

        // Zid adherent_id f performances
        Schema::table('performance', function (Blueprint $table) {
            $table->foreignId('adherent_id')->constrained('adherents')->onDelete('cascade');
        });

        // Zid adherent_id f notifications
        Schema::table('notification', function (Blueprint $table) {
            $table->foreignId('adherent_id')->constrained('adherents')->onDelete('cascade');
        });

        // Zid adherent_id + coach_id f messages
        Schema::table('message', function (Blueprint $table) {
            $table->foreignId('adherent_id')->constrained('adherents')->onDelete('cascade');
            $table->foreignId('coach_id')->constrained('coachs')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('cours', function (Blueprint $table) {
            $table->dropForeign(['coach_id']);
            $table->dropColumn('coach_id');
        });

        Schema::table('abonnement', function (Blueprint $table) {
            $table->dropForeign(['adherent_id']);
            $table->dropColumn('adherent_id');
        });

        Schema::table('reservation', function (Blueprint $table) {
            $table->dropForeign(['adherent_id']);
            $table->dropForeign(['cours_id']);
            $table->dropColumn(['adherent_id', 'cours_id']);
        });

        Schema::table('paiement', function (Blueprint $table) {
            $table->dropForeign(['adherent_id']);
            $table->dropForeign(['abonnement_id']);
            $table->dropColumn(['adherent_id', 'abonnement_id']);
        });

        Schema::table('performance', function (Blueprint $table) {
            $table->dropForeign(['adherent_id']);
            $table->dropColumn('adherent_id');
        });

        Schema::table('notification', function (Blueprint $table) {
            $table->dropForeign(['adherent_id']);
            $table->dropColumn('adherent_id');
        });

        Schema::table('message', function (Blueprint $table) {
            $table->dropForeign(['adherent_id']);
            $table->dropForeign(['coach_id']);
            $table->dropColumn(['adherent_id', 'coach_id']);
        });
    }
};