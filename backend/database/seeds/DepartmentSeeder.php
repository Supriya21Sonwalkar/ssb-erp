<?php

 

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run()
    {
        $departments = [
            ['department_name' => 'Administration', 'department_code' => 'ADMIN'],
            ['department_name' => 'Accounts', 'department_code' => 'ACC'],
            ['department_name' => 'Human Resources', 'department_code' => 'HR'],
            ['department_name' => 'Teaching', 'department_code' => 'TEACH'],
            ['department_name' => 'Transport', 'department_code' => 'TRANS'],
            ['department_name' => 'Library', 'department_code' => 'LIB'],
            ['department_name' => 'Sports', 'department_code' => 'SPORT'],
            ['department_name' => 'IT', 'department_code' => 'IT'],
            ['department_name' => 'Security', 'department_code' => 'SEC'],
        ];

        foreach ($departments as $department) {
            Department::updateOrCreate(
                ['department_code' => $department['department_code']],
                array_merge($department, [
                    'status' => 1,
                    'description' => null,
                ])
            );
        }
    }
}