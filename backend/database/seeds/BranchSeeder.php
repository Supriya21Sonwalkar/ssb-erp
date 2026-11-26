<?php



use Illuminate\Database\Seeder;
use App\Models\Branch;

class BranchSeeder extends Seeder
{
    public function run()
    {
        $branches = [
            [
                'branch_name' => 'Main Campus',
                'branch_code' => 'MAIN',
                'status' => 1,
            ],
            [
                'branch_name' => 'Junior Wing',
                'branch_code' => 'JR',
                'status' => 1,
            ],
            [
                'branch_name' => 'Senior Wing',
                'branch_code' => 'SR',
                'status' => 1,
            ],
        ];

        foreach ($branches as $branch) {
            Branch::updateOrCreate(
                ['branch_code' => $branch['branch_code']],
                $branch
            );
        }
    }
}