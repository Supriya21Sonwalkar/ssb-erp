<?php

 

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Resource;

class ResourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $resources = [
            ['title' => 'NDA Maths & GAT Syllabus PDF', 'category' => 'nda_syllabus', 'file_path' => 'nda_syllabus.pdf', 'is_new' => true],
            ['title' => 'NDA Written Exam Pattern Guide', 'category' => 'nda_syllabus', 'file_path' => 'nda_pattern.pdf', 'is_new' => false],
            ['title' => 'SSB Psychological Tests Workbook', 'category' => 'ssb_prep', 'file_path' => 'ssb_psychology.pdf', 'is_new' => true],
            ['title' => 'GTO Strategy & Practice Manual', 'category' => 'ssb_prep', 'file_path' => 'gto_manual.pdf', 'is_new' => false],
            ['title' => 'NDA Previous Year Papers PDF', 'category' => 'previous_papers', 'file_path' => 'nda_prev_papers.pdf', 'is_new' => true],
            ['title' => 'AFCAT & CDS Solved Papers', 'category' => 'previous_papers', 'file_path' => 'cds_solved.pdf', 'is_new' => false],
            ['title' => 'Defence Current Affairs Monthly Digest', 'category' => 'current_affairs', 'file_path' => 'current_affairs_monthly.pdf', 'is_new' => false],
            ['title' => 'One-Year Current Affairs Compilation', 'category' => 'current_affairs', 'file_path' => 'current_affairs_yearly.pdf', 'is_new' => true],
        ];

        foreach ($resources as $resource) {
            Resource::updateOrCreate(
                ['title' => $resource['title']],
                $resource
            );
        }
    }
}
