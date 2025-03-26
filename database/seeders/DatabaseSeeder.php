<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->call([
            RolesAndPermissionsSeeder::class,
        ]);

        $admin = User::firstOrCreate(
            ['email' => 'hisyam@example.com'],
            [
                'name' => 'Hisyam',
                'password' => Hash::make('password'),
            ]
        );
        $admin->assignRole('admin');
    
        // Buat User Tedrik sebagai User
        $user = User::firstOrCreate(
            ['email' => 'tedrik@example.com'],
            [
                'name' => 'Tedrik',
                'password' => Hash::make('password'),
            ]
        );
        $user->assignRole('user');
    }
}
