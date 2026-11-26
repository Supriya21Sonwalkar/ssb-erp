<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeworkAssignmentAttachment extends Model
{
    protected $table = 'homework_assignment_attachments';

    protected $fillable = [
        'homework_assignment_id',
        'file_name',
        'file_path',
        'file_type',
        'file_size',
    ];


    /*
    |--------------------------------------------------------------------------
    | Homework Assignment
    |--------------------------------------------------------------------------
    */

    public function homework()
    {
        return $this->belongsTo(
            HomeworkAssignment::class,
            'homework_assignment_id'
        );
    }
}