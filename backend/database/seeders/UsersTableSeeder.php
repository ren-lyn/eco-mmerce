<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        User::insert([
            [
                'name' => 'seller',
                'email' => 'seller@gmail.com',
                'password' => Hash::make('seller'),
                'role' => 'employee',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Customer',
                'email' => 'customer@gmail.com',
                'password' => Hash::make('customer'),
                'role' => 'customer',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
        ]);
    }
}
