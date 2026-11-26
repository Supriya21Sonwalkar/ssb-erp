<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            CourseSeeder::class,
            TestimonialSeeder::class,
            GallerySeeder::class,
            ResourceSeeder::class,
            RoleSeeder::class,
            UsersSeeder::class,
            BranchSeeder::class,
            DepartmentSeeder::class,
            DesignationSeeder::class,
            ModuleSeeder::class,

            // Student Management
            AcademicYearSeeder::class,  // Academic years (2022-2023 to 2026-2027)
            ClassSeeder::class,         // Classes (Nursery, LKG, UKG, Class 1-12)
            SectionSeeder::class,       // Sections (Section A for each class) — must run AFTER ClassSeeder
        ]);
    }
}