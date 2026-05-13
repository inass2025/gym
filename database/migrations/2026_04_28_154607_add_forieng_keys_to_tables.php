<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── ÉTAPE 1 : cours - coach_id ──
        if (Schema::hasTable('cours') && !Schema::hasColumn('cours', 'coach_id')) {
            Schema::table('cours', function (Blueprint $table) {
                $table->unsignedBigInteger('coach_id')->nullable();
                $table->foreign('coach_id')->references('id')->on('adherents')->onDelete('cascade');
            });
        }

        // ── ÉTAPE 2 : abonnement - adherent_id ──
        if (Schema::hasTable('abonnement') && !Schema::hasColumn('abonnement', 'adherent_id')) {
            Schema::table('abonnement', function (Blueprint $table) {
                $table->foreignId('adherent_id')->constrained('adherents')->onDelete('cascade');
            });
        }

        // ── ÉTAPE 3 : reservation - adherent_id + cours_id ──
        if (Schema::hasTable('reservation')) {
            Schema::table('reservation', function (Blueprint $table) {
                if (!Schema::hasColumn('reservation', 'adherent_id')) {
                    $table->foreignId('adherent_id')->constrained('adherents')->onDelete('cascade');
                }
                if (!Schema::hasColumn('reservation', 'cours_id')) {
                    $table->unsignedBigInteger('cours_id')->nullable();
                    $table->foreign('cours_id')->references('id')->on('cours')->onDelete('cascade');
                }
            });
        }

        // ── ÉTAPE 4 : paiement - adherent_id + abonnement_id ──
        if (Schema::hasTable('paiement')) {
            Schema::table('paiement', function (Blueprint $table) {
                if (!Schema::hasColumn('paiement', 'adherent_id')) {
                    $table->foreignId('adherent_id')->constrained('adherents')->onDelete('cascade');
                }
                if (!Schema::hasColumn('paiement', 'abonnement_id')) {
                    $table->foreignId('abonnement_id')->constrained('abonnement')->onDelete('cascade');
                }
            });
        }

        // ── ÉTAPE 5 : performance - adherent_id ──
        if (Schema::hasTable('performance') && !Schema::hasColumn('performance', 'adherent_id')) {
            Schema::table('performance', function (Blueprint $table) {
                $table->foreignId('adherent_id')->constrained('adherents')->onDelete('cascade');
            });
        }

        // ── ÉTAPE 6 : notifications - adherent_id ──
        if (Schema::hasTable('notifications') && !Schema::hasColumn('notifications', 'adherent_id')) {
            Schema::table('notifications', function (Blueprint $table) {
                $table->foreignId('adherent_id')->constrained('adherents')->onDelete('cascade');
            });
        }

        // ── ÉTAPE 7 : message - adherent_id + coach_id ──
        if (Schema::hasTable('message')) {
            Schema::table('message', function (Blueprint $table) {
                if (!Schema::hasColumn('message', 'adherent_id')) {
                    $table->foreignId('adherent_id')->constrained('adherents')->onDelete('cascade');
                }
                if (!Schema::hasColumn('message', 'coach_id')) {
                    $table->unsignedBigInteger('coach_id')->nullable();
                    $table->foreign('coach_id')->references('id')->on('adherents')->onDelete('cascade');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('cours')) {
            Schema::table('cours', function (Blueprint $table) {
                $table->dropForeign(['coach_id']);
                $table->dropColumn('coach_id');
            });
        }

        if (Schema::hasTable('abonnement')) {
            Schema::table('abonnement', function (Blueprint $table) {
                $table->dropForeign(['adherent_id']);
                $table->dropColumn('adherent_id');
            });
        }

        if (Schema::hasTable('reservation')) {
            Schema::table('reservation', function (Blueprint $table) {
                $table->dropForeign(['adherent_id']);
                $table->dropForeign(['cours_id']);
                $table->dropColumn(['adherent_id', 'cours_id']);
            });
        }

        if (Schema::hasTable('paiement')) {
            Schema::table('paiement', function (Blueprint $table) {
                $table->dropForeign(['adherent_id']);
                $table->dropForeign(['abonnement_id']);
                $table->dropColumn(['adherent_id', 'abonnement_id']);
            });
        }

        if (Schema::hasTable('performance')) {
            Schema::table('performance', function (Blueprint $table) {
                $table->dropForeign(['adherent_id']);
                $table->dropColumn('adherent_id');
            });
        }

        if (Schema::hasTable('notifications')) {
            Schema::table('notifications', function (Blueprint $table) {
                $table->dropForeign(['adherent_id']);
                $table->dropColumn('adherent_id');
            });
        }

        if (Schema::hasTable('message')) {
            Schema::table('message', function (Blueprint $table) {
                $table->dropForeign(['adherent_id']);
                $table->dropForeign(['coach_id']);
                $table->dropColumn(['adherent_id', 'coach_id']);
            });
        }
    }
};