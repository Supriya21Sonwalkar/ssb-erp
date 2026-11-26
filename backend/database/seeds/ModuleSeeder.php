<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('modules')->insert([

            // ===== Academic Structure =====

            [
                'module_name'   => 'Academic Management',
                'module_slug'   => 'academic-management',
                'module_icon'   => 'FaGraduationCap',
                'description'   => 'Academic years, classes, sections, subjects and timetable.',
                'display_order' => 1,
                'status'        => 1,
                'created_at'    => Carbon::now(),
                'updated_at'    => Carbon::now(),
            ],

            [
                'module_name'   => 'Student Management',
                'module_slug'   => 'student-management',
                'module_icon'   => 'FaUsers',
                'description'   => 'Student records, admissions, profiles and student-related data.',
                'display_order' => 2,
                'status'        => 1,
                'created_at'    => Carbon::now(),
                'updated_at'    => Carbon::now(),
            ],

            [
                'module_name'   => 'Attendance Management',
                'module_slug'   => 'attendance-management',
                'module_icon'   => 'FaClipboardList',
                'description'   => 'Daily attendance tracking and attendance reports.',
                'display_order' => 3,
                'status'        => 1,
                'created_at'    => Carbon::now(),
                'updated_at'    => Carbon::now(),
            ],

            [
                'module_name'   => 'Homework & Assignment Management',
                'module_slug'   => 'homework-assignment-management',
                'module_icon'   => 'FaFileAlt',
                'description'   => 'Assign, collect and evaluate homework and assignments.',
                'display_order' => 4,
                'status'        => 1,
                'created_at'    => Carbon::now(),
                'updated_at'    => Carbon::now(),
            ],

            // ===== Administration =====

            [
                'module_name'   => 'Configuration',
                'module_slug'   => 'configuration',
                'module_icon'   => 'FaCog',
                'description'   => 'Master configuration and system settings.',
                'display_order' => 5,
                'status'        => 1,
                'created_at'    => Carbon::now(),
                'updated_at'    => Carbon::now(),
            ],

            [
                'module_name'   => 'Fees Management',
                'module_slug'   => 'fees-management',
                'module_icon'   => 'FaMoneyBill',
                'description'   => 'Fee structures, invoices, payments and financial tracking.',
                'display_order' => 6,
                'status'        => 1,
                'created_at'    => Carbon::now(),
                'updated_at'    => Carbon::now(),
            ],

        ]);
    }
}
