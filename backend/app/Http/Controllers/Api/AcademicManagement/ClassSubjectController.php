<?php

namespace App\Http\Controllers\Api\AcademicManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ClassSubject;
use App\Models\Classes;
use App\Models\Subject;

class ClassSubjectController extends Controller
{
    /**
     * Active Records
     */
    public function index()
    {
        $classSubjects = Classes::with([
            'classSubjects.subject'
        ])
        ->where('status', 1)
        ->orderBy('display_order')
        ->get();

        return response()->json([
            'status' => true,
            'data' => $classSubjects
        ]);
    }

    /**
     * Create Mapping
     */
    public function store(Request $request)
    {
        $request->validate([
            'class_id' => 'required|exists:classes,id',
            'subject_ids' => 'required|array|min:1',
            'subject_ids.*' => 'exists:subjects,id',
        ]);

        foreach ($request->subject_ids as $subjectId) {

            ClassSubject::firstOrCreate(

                [
                    'class_id' => $request->class_id,
                    'subject_id' => $subjectId,
                ],

                [
                    'is_compulsory' => true,
                    'display_order' => 1,
                    'status' => 1,
                    'created_by' => auth()->id(),
                ]
            );
        }

        return response()->json([
            'status' => true,
            'message' => 'Subjects Assigned Successfully.'
        ]);
    }

    /**
     * Show
     */
    public function show($classId)
    {
        $class = SchoolClass::with([
            'classSubjects.subject'
        ])->findOrFail($classId);

        return response()->json([
            'status' => true,
            'data' => $class
        ]);
    }

    /**
     * Edit Data
     */
    public function edit($classId)
    {
        $class = SchoolClass::with([
            'classSubjects.subject'
        ])->findOrFail($classId);

        $subjects = Subject::where('status',1)
                    ->orderBy('subject_name')
                    ->get();

        return response()->json([
            'status' => true,
            'class' => $class,
            'subjects' => $subjects
        ]);
    }

    /**
     * Update Mapping
     */
    public function update(Request $request, $classId)
    {
        $request->validate([
            'subject_ids' => 'required|array|min:1',
            'subject_ids.*' => 'exists:subjects,id',
        ]);

        ClassSubject::where('class_id', $classId)->delete();

        foreach ($request->subject_ids as $subjectId) {

            ClassSubject::create([

                'class_id' => $classId,
                'subject_id' => $subjectId,
                'is_compulsory' => true,
                'display_order' => 1,
                'status' => 1,
                'created_by' => auth()->id(),

            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Class Subjects Updated Successfully.'
        ]);
    }

    /**
     * Inactive Records
     */
    public function inactive()
    {
        $classSubjects = ClassSubject::with([
                'class',
                'subject'
            ])
            ->where('status',0)
            ->get();

        return response()->json([
            'status' => true,
            'data' => $classSubjects
        ]);
    }

    /**
     * Soft Delete
     */
    public function destroy($id)
    {
        $record = ClassSubject::findOrFail($id);

        $record->status = 0;
        $record->save();

        return response()->json([
            'status' => true,
            'message' => 'Record moved to inactive.'
        ]);
    }

    /**
     * Restore
     */
    public function restore($id)
    {
        $record = ClassSubject::findOrFail($id);

        $record->status = 1;
        $record->save();

        return response()->json([
            'status' => true,
            'message' => 'Record restored successfully.'
        ]);
    }
}