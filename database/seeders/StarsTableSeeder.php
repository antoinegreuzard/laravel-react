<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Star;

class StarsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        // Crée et insère 10 enregistrements dans la base de données
        Star::factory()->count(10)->create();
    }
}
