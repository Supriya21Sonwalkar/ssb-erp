<?php

use Illuminate\Database\Seeder;
use App\Models\Designation;

class DesignationSeeder extends Seeder
{
    public function run()
    {
        $designations = [
            ['designation_name' => 'Principal', 'designation_code' => 'PRINCIPAL'],
            ['designation_name' => 'Vice Principal', 'designation_code' => 'VICE'],
            ['designation_name' => 'Administrator', 'designation_code' => 'ADMIN'],
            ['designation_name' => 'HR Manager', 'designation_code' => 'HRM'],
            ['designation_name' => 'Accountant', 'designation_code' => 'ACC'],
            ['designation_name' => 'Teacher', 'designation_code' => 'TEACHER'],
            ['designation_name' => 'Coordinator', 'designation_code' => 'COORD'],
            ['designation_name' => 'Librarian', 'designation_code' => 'LIB'],
            ['designation_name' => 'Sports Teacher', 'designation_code' => 'SPORT'],
            ['designation_name' => 'Driver', 'designation_code' => 'DRIVER'],
            ['designation_name' => 'Conductor', 'designation_code' => 'CONDUCTOR'],
            ['designation_name' => 'Peon', 'designation_code' => 'PEON'],
            ['designation_name' => 'Security Guard', 'designation_code' => 'SECURITY'],
            ['designation_name' => 'Receptionist', 'designation_code' => 'RECEPTION'],
        ];

        foreach ($designations as $designation) {
            Designation::updateOrCreate(
                ['designation_code' => $designation['designation_code']],
                array_merge($designation, [
                    'status' => 1,
                    'description' => null,
                ])
            );
        }
    }
}