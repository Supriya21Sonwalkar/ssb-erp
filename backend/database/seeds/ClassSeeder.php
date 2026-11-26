<?php

use Illuminate\Database\Seeder;
use App\Models\Classes;

class ClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Creates standard school classes:
     * Nursery, LKG, UKG, Class 1 through Class 12
     * Each with display_order for proper dropdown sorting.
     */
    public function run()
    {
        $classes = [
            [
                'class_name'    => 'Nursery',
                'class_code'    => 'NUR',
                'display_order' => 1,
                'capacity'      => 40,
                'status'        => true,
            ],
            [
                'class_name'    => 'LKG',
                'class_code'    => 'LKG',
                'display_order' => 2,
                'capacity'      => 40,
                'status'        => true,
            ],
            [
                'class_name'    => 'UKG',
                'class_code'    => 'UKG',
                'display_order' => 3,
                'capacity'      => 40,
                'status'        => true,
            ],
            [
                'class_name'    => 'Class 1',
                'class_code'    => 'CL1',
                'display_order' => 4,
                'capacity'      => 45,
                'status'        => true,
            ],
            [
                'class_name'    => 'Class 2',
                'class_code'    => 'CL2',
                'display_order' => 5,
                'capacity'      => 45,
                'status'        => true,
            ],
            [
                'class_name'    => 'Class 3',
                'class_code'    => 'CL3',
                'display_order' => 6,
                'capacity'      => 45,
                'status'        => true,
            ],
            [
                'class_name'    => 'Class 4',
                'class_code'    => 'CL4',
                'display_order' => 7,
                'capacity'      => 45,
                'status'        => true,
            ],
            [
                'class_name'    => 'Class 5',
                'class_code'    => 'CL5',
                'display_order' => 8,
                'capacity'      => 45,
                'status'        => true,
            ],
            [
                'class_name'    => 'Class 6',
                'class_code'    => 'CL6',
                'display_order' => 9,
                'capacity'      => 45,
                'status'        => true,
            ],
            [
                'class_name'    => 'Class 7',
                'class_code'    => 'CL7',
                'display_order' => 10,
                'capacity'      => 45,
                'status'        => true,
            ],
            [
                'class_name'    => 'Class 8',
                'class_code'    => 'CL8',
                'display_order' => 11,
                'capacity'      => 45,
                'status'        => true,
            ],
            [
                'class_name'    => 'Class 9',
                'class_code'    => 'CL9',
                'display_order' => 12,
                'capacity'      => 45,
                'status'        => true,
            ],
            [
                'class_name'    => 'Class 10',
                'class_code'    => 'CL10',
                'display_order' => 13,
                'capacity'      => 45,
                'status'        => true,
            ],
            [
                'class_name'    => 'Class 11',
                'class_code'    => 'CL11',
                'display_order' => 14,
                'capacity'      => 45,
                'status'        => true,
            ],
            [
                'class_name'    => 'Class 12',
                'class_code'    => 'CL12',
                'display_order' => 15,
                'capacity'      => 45,
                'status'        => true,
            ],
        ];

        foreach ($classes as $class) {
            Classes::updateOrCreate(
                ['class_name' => $class['class_name']],
                $class
            );
        }

        $this->command->info('ClassSeeder: 15 classes seeded (Nursery, LKG, UKG, Class 1-12).');
    }
}
