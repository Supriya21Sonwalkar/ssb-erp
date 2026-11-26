<?php

use Illuminate\Database\Seeder;
use App\Models\AcademicYear;

class AcademicYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Covers 3 past years, the current year (2025-2026), and the next year.
     * Only 2025-2026 is flagged as is_current = true.
     */
    public function run()
    {
        $academicYears = [
            [
                'academic_year' => '2022-2023',
                'start_date'    => '2022-06-01',
                'end_date'      => '2023-03-31',
                'is_current'    => false,
                'status'        => true,
            ],
            [
                'academic_year' => '2023-2024',
                'start_date'    => '2023-06-01',
                'end_date'      => '2024-03-31',
                'is_current'    => false,
                'status'        => true,
            ],
            [
                'academic_year' => '2024-2025',
                'start_date'    => '2024-06-01',
                'end_date'      => '2025-03-31',
                'is_current'    => false,
                'status'        => true,
            ],
            [
                'academic_year' => '2025-2026',
                'start_date'    => '2025-06-01',
                'end_date'      => '2026-03-31',
                'is_current'    => true,   // Active academic year
                'status'        => true,
            ],
            [
                'academic_year' => '2026-2027',
                'start_date'    => '2026-06-01',
                'end_date'      => '2027-03-31',
                'is_current'    => false,
                'status'        => true,
            ],
        ];

        foreach ($academicYears as $year) {
            AcademicYear::updateOrCreate(
                ['academic_year' => $year['academic_year']],
                $year
            );
        }

        $this->command->info('AcademicYearSeeder: 5 academic years seeded (2022-2023 to 2026-2027).');
    }
}
