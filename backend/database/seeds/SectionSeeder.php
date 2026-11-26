<?php

use Illuminate\Database\Seeder;
use App\Models\Classes;
use App\Models\Section;

class SectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Creates one section (Section A) for every class.
     * Depends on ClassSeeder having already run.
     */
    public function run()
    {
        // All class names in the order they were seeded
        $classNames = [
            'Nursery',
            'LKG',
            'UKG',
            'Class 1',
            'Class 2',
            'Class 3',
            'Class 4',
            'Class 5',
            'Class 6',
            'Class 7',
            'Class 8',
            'Class 9',
            'Class 10',
            'Class 11',
            'Class 12',
        ];

        $sectionName = 'A';

        foreach ($classNames as $className) {

            // Look up the class by name
            $class = Classes::where('class_name', $className)->first();

            if (!$class) {
                $this->command->warn("SectionSeeder: Class '{$className}' not found. Skipping.");
                continue;
            }

            Section::updateOrCreate(
                [
                    'class_id'     => $class->id,
                    'section_name' => $sectionName,
                ],
                [
                    'class_id'     => $class->id,
                    'section_name' => $sectionName,
                    'room_number'  => null,
                    'capacity'     => 45,
                    'status'       => true,
                ]
            );
        }

        $this->command->info('SectionSeeder: Section A seeded for all 15 classes.');
    }
}
