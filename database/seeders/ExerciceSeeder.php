<?php

namespace Database\Seeders;

use App\Models\Exercice;
use Illuminate\Database\Seeder;

class ExerciceSeeder extends Seeder
{
    public function run(): void
    {
        $exercices = [
            ['nom' => 'Développé couché',   'muscle' => 'Pectoraux',    'materiel' => 'Barre',         'difficulte' => 'Intermédiaire', 'emoji' => '🏋️'],
            ['nom' => 'Tractions',           'muscle' => 'Dos',          'materiel' => 'Poids du corps','difficulte' => 'Avancé',        'emoji' => '🔝'],
            ['nom' => 'Squats',              'muscle' => 'Jambes',       'materiel' => 'Barre',         'difficulte' => 'Débutant',      'emoji' => '🦵'],
            ['nom' => 'Développé épaules',  'muscle' => 'Épaules',      'materiel' => 'Haltères',      'difficulte' => 'Intermédiaire', 'emoji' => '💪'],
            ['nom' => 'Gainage planche',     'muscle' => 'Abdominaux',   'materiel' => 'Poids du corps','difficulte' => 'Débutant',      'emoji' => '🔥'],
            ['nom' => 'HIIT Cardio',         'muscle' => 'Cardio',       'materiel' => 'Tapis',         'difficulte' => 'Intermédiaire', 'emoji' => '🏃'],
        ];

        foreach ($exercices as $ex) {
            Exercice::create($ex);
        }
    }
}