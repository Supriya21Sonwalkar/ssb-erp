<?php

 

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $courses = [
            [
                'title' => 'Schooling + NDA + SSB After 10th',
                'subtitle' => 'INTEGRATED 2-YEAR RESIDENTIAL PROGRAM',
                'slug' => 'schooling-nda-ssb-after-10th',
                'description' => 'A comprehensive 2-year program combining regular schooling with intensive NDA and SSB preparation for Class 10th students.',
                'icon_class' => 'school',
                'order_number' => 1,
                'features' => ['Regular Schooling', 'NDA Written Prep', 'SSB Interview Training', 'Physical Fitness'],
                'is_active' => true,
                'fees' => 180000.00,
            ],
            [
                'title' => 'Sainik School / RMS / RIMC',
                'subtitle' => 'ENTRANCE EXAM SPECIALIZATION',
                'slug' => 'sainik-school-rms-rimc',
                'description' => 'Targeted coaching for students aspiring to join Sainik Schools, Rashtriya Military Schools, and RIMC.',
                'icon_class' => 'military_tech',
                'order_number' => 2,
                'features' => ['Exam Focused Study', 'Mock Tests', 'Interview Guidance', 'Residential Facility'],
                'is_active' => true,
                'fees' => 95000.00,
            ],
            [
                'title' => 'NDA + SSB After 12th',
                'subtitle' => 'INTENSIVE 1-YEAR TARGET BATCH',
                'slug' => 'nda-ssb-after-12th',
                'description' => 'Rigorous training for Class 12th pass students to clear NDA written exam and excel in SSB interview.',
                'icon_class' => 'flight_takeoff',
                'order_number' => 3,
                'features' => ['Daily 8-hour Classes', 'Weekly Mock Tests', 'GTO Ground Practice', 'Personalized Mentoring'],
                'is_active' => true,
                'fees' => 120000.00,
            ],
            [
                'title' => 'CDS / OTA / AFCAT After 12th',
                'subtitle' => 'GRADUATION FOUNDATION PROGRAM',
                'slug' => 'cds-ota-afcat-after-12th',
                'description' => 'Prepare for CDS, OTA, and AFCAT while pursuing your graduation. Build a strong foundation early.',
                'icon_class' => 'groups',
                'order_number' => 4,
                'features' => ['Flexible Schedule', 'Focus on GK & English', 'Personality Development', 'SSB Orientation'],
                'is_active' => true,
                'fees' => 85000.00,
            ],
            [
                'title' => 'CDS / OTA / AFCAT with Graduation',
                'subtitle' => 'EXAM SPECIFIC CRASH COURSE',
                'slug' => 'cds-ota-afcat-with-graduation',
                'description' => 'Intensive coaching for final year students and graduates for CDS, OTA, and AFCAT entries.',
                'icon_class' => 'workspace_premium',
                'order_number' => 5,
                'features' => ['Advanced Syllabus Coverage', 'Previous Year Papers', 'SSB Screening Test', 'Interview Techniques'],
                'is_active' => true,
                'fees' => 110000.00,
            ],
            [
                'title' => 'SSB Training (21-day intensive)',
                'subtitle' => '21-DAY PSYCHOLOGY & GTO FOCUS',
                'slug' => 'ssb-training-21-day-intensive',
                'description' => 'A short-term, high-impact program focusing on Psychology tests, GTO tasks, and Personal Interviews.',
                'icon_class' => 'psychology',
                'order_number' => 6,
                'features' => ['Psychology Assessment', 'GTO Ground Training', 'Mock Interviews', 'Daily Group Tasks'],
                'is_active' => true,
                'fees' => 45000.00,
            ],
        ];

        foreach ($courses as $course) {
            Course::updateOrCreate(
                ['slug' => $course['slug']],
                $course
            );
        }
    }
}
