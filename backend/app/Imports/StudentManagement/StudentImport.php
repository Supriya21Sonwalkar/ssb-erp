<?php

namespace App\Imports\StudentManagement;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class StudentImport implements
    ToCollection,
    WithHeadingRow
{
    /**
     * Imported Rows
     *
     * @var array
     */
    protected $rows = [];

    /**
     * Read Excel Collection
     */
    public function collection(Collection $collection)
    {
        foreach ($collection as $row) {

            $data = $row->toArray();

            if (
                empty(
                    array_filter(
                        $data,
                        function ($value) {
                            return $value !== null &&
                                $value !== '';
                        }
                    )
                )
            ) {
                continue;
            }

            foreach ($data as $key => $value) {

                if (is_string($value)) {
                    $data[$key] = trim($value);
                }
            }

            /*
            |--------------------------------------------------------------------------
            | Normalize Excel Heading Keys
            |--------------------------------------------------------------------------
            */

            if (
                array_key_exists(
                    'previous_school_percentagegrade',
                    $data
                )
            ) {

                $data['previous_school_percentage_grade'] =
                    $data['previous_school_percentagegrade'];

                unset(
                    $data['previous_school_percentagegrade']
                );
            }

            if (
                array_key_exists(
                    'father_panelection_no',
                    $data
                )
            ) {

                $data['father_pan_election_no'] =
                    $data['father_panelection_no'];

                unset(
                    $data['father_panelection_no']
                );
            }

            if (
                array_key_exists(
                    'mother_panelection_no',
                    $data
                )
            ) {

                $data['mother_pan_election_no'] =
                    $data['mother_panelection_no'];

                unset(
                    $data['mother_panelection_no']
                );
            }

            $this->rows[] = $data;
        }
    }

    /**
     * Return Imported Rows
     */
    public function getRows()
    {
        return $this->rows;
    }
}