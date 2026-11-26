<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

use App\Http\Controllers\React\HomeController;
// use App\Http\Controllers\React\CourseController;
use App\Http\Controllers\React\GalleryController;
use App\Http\Controllers\React\ResourceController;
use App\Http\Controllers\React\ContactController;
use App\Http\Controllers\React\BookingController;
use App\Http\Controllers\React\StudentRegistrationController;

use App\Http\Controllers\Api\AcademicManagement\AcademicYearController;
use App\Http\Controllers\Api\AcademicManagement\ClassController;
use App\Http\Controllers\Api\AcademicManagement\SectionController;
use App\Http\Controllers\Api\AcademicManagement\SubjectController;
use App\Http\Controllers\Api\AcademicManagement\ClassSubjectController;
use App\Http\Controllers\Api\AcademicManagement\TeacherAllocationController;
use App\Http\Controllers\Api\EmployeeController;

use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserManagement\UserController;
use App\Http\Controllers\Api\UserManagement\RoleMenuPermissionController;

use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\DesignationController;
use App\Http\Controllers\Api\ModuleController;
use App\Http\Controllers\Api\PermissionController;


use App\Http\Controllers\Api\StudentManagement\StudentController;
use App\Http\Controllers\Api\StudentManagement\StudentBulkImportController;

use App\Http\Controllers\Api\AttendanceManagement\DailyAttendanceController;
use App\Http\Controllers\Api\AttendanceManagement\AttendanceReportController;
use App\Http\Controllers\Api\AttendanceManagement\LectureAttendanceController;
use App\Http\Controllers\Api\HomeworkAssignment\HomeworkAssignmentController;
use App\Http\Controllers\Api\HomeworkAssignment\HomeworkSubmissionController;

use App\Http\Controllers\Api\Course\CourseController;
use App\Http\Controllers\Api\Course\FeeComponentController;
use App\Http\Controllers\Api\Course\InstallmentController;
use App\Http\Controllers\Api\Course\FeeStructureController;
use App\Http\Controllers\Api\Course\FeePaymentController;
use App\Http\Controllers\Api\Course\FeeWaiverController;

use App\Http\Controllers\Api\Configuration\AssetCategoryController;
use App\Http\Controllers\Api\Configuration\AssetSubcategoryController;
use App\Http\Controllers\Api\Configuration\AssetController;

use App\Http\Controllers\Api\TeacherApp\TeacherController;

use App\Http\Controllers\Api\Communication\NoticeController;


// Authentication Routes (No prefix - public endpoints)
Route::post('/login', [AuthController::class, 'login']);
Route::get('/roles', [RoleController::class, 'index']);

// Dropdown data routes (public endpoints)
Route::get('/branches', [BranchController::class, 'index']);
Route::get('/departments', [DepartmentController::class, 'index']);
Route::get('/designations', [DesignationController::class, 'index']);
Route::get('/employee/list', [EmployeeController::class, 'list']);
Route::post('/employee/check-aadhaar', [EmployeeController::class, 'checkAadhaar']);

Route::prefix('react')->group(function () {

    Route::get('/home', [HomeController::class, 'index']);
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{slug}', [CourseController::class, 'show']);
    Route::get('/gallery', [GalleryController::class, 'index']);
    Route::get('/resources', [ResourceController::class, 'index']);
    Route::post('/contact', [ContactController::class, 'store']);
    Route::post('/booking', [BookingController::class, 'store']);

    // Public Student Registration
    Route::get('/student-registration/dropdowns', [StudentRegistrationController::class, 'dropdowns']);
    Route::get('/student-registration/sections-by-class/{classId}', [StudentRegistrationController::class, 'sectionsByClass']);
    Route::post('/student-registration/register', [StudentRegistrationController::class, 'register']);
});

Route::middleware('auth:sanctum')->group(function () {


    Route::prefix('user-management')->group(function () {

        Route::prefix('roles')->group(function () {
            Route::get('/', [RoleController::class, 'index']);
            Route::get('/{id}', [RoleController::class, 'show']);
            Route::post('/', [RoleController::class, 'store']);
            Route::put('/{id}', [RoleController::class, 'update']);
            Route::delete('/{id}', [RoleController::class, 'destroy']);
        });

        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'index']);
            Route::post('/', [UserController::class, 'store']);
            Route::get('/{id}', [UserController::class, 'show']);
            Route::put('/{id}', [UserController::class, 'update']);
            Route::patch('/{id}/status', [UserController::class,'updateStatus']);
        });

        Route::prefix('role-menu-permissions')->group(function () {
            Route::get('/roles', [RoleMenuPermissionController::class,'roles']);
            Route::get('/modules', [RoleMenuPermissionController::class,'modules']);
            Route::get('/menus', [RoleMenuPermissionController::class,'moduleMenus']);
            Route::post('/save', [RoleMenuPermissionController::class,'save']);
            Route::get('/my-menu-permissions',[RoleMenuPermissionController::class, 'myMenus']);
        });
        
    });
    
    //teacher app
    Route::get('/teacher/dashboard', [TeacherController::class,'dashboard']);

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
        
    // Academic Management Routes (Public for now - move to auth group later)
    Route::prefix('academic-management')->group(function () {

        // Academic Year
        Route::prefix('academic-years')->group(function () {
            Route::get('/', [AcademicYearController::class, 'index']);
            Route::post('/', [AcademicYearController::class, 'store']);
            Route::get('/{id}', [AcademicYearController::class, 'show']);
            Route::put('/{id}', [AcademicYearController::class, 'update']);
            Route::get('/inactive', [AcademicYearController::class, 'inactive']);
            Route::delete('/{id}', [AcademicYearController::class, 'destroy']);
            Route::patch('/{id}/restore', [AcademicYearController::class, 'restore']);
        });

        // Class Master
        Route::prefix('classes')->group(function () {
            Route::get('/', [ClassController::class, 'index']);
            Route::post('/', [ClassController::class, 'store']);
            Route::get('/{id}', [ClassController::class, 'show']);
            Route::put('/{id}', [ClassController::class, 'update']);
            Route::delete('/{id}', [ClassController::class, 'destroy']);
            Route::get('/inactive/list', [ClassController::class, 'inactive']);
            Route::put('/{id}/restore', [ClassController::class, 'restore']);
        });

        // Section
        Route::prefix('sections')->group(function () {
            Route::get('/', [SectionController::class, 'index']);
            Route::get('/class/{classId}', [SectionController::class, 'getByClass']);
            Route::post('/', [SectionController::class, 'store']);
            Route::get('/{id}', [SectionController::class, 'show']);
            Route::put('/{id}', [SectionController::class, 'update']);
            Route::get('/inactive', [SectionController::class, 'inactive']);
            Route::put('/{id}/restore', [SectionController::class, 'restore']);
        });

        // Subject
        Route::prefix('subjects')->group(function () {
            Route::get('/', [SubjectController::class, 'index']);
            Route::post('/', [SubjectController::class, 'store']);
            Route::get('/{id}', [SubjectController::class, 'show']);
            Route::put('/{id}', [SubjectController::class, 'update']);
            Route::delete('/{id}', [SubjectController::class, 'destroy']);
            Route::get('/inactive', [SubjectController::class, 'inactive']);
            Route::put('/{id}/restore', [SubjectController::class, 'restore']);
        });

        // Class Subject
        Route::prefix('class-subjects')->group(function () {
            Route::get('/', [ClassSubjectController::class, 'index']);
            Route::post('/', [ClassSubjectController::class, 'store']);
            Route::get('/{id}', [ClassSubjectController::class, 'show']);
            Route::get('/{id}/edit', [ClassSubjectController::class, 'edit']);
            Route::put('/{id}', [ClassSubjectController::class, 'update']);
            Route::delete('/{id}', [ClassSubjectController::class, 'destroy']);
            Route::get('/inactive', [ClassSubjectController::class, 'inactive']);
            Route::put('/{id}/restore', [ClassSubjectController::class, 'restore']);
        });
        Route::prefix('teacher-allocations')->group(function () {
            // Listing
            Route::get('/', [TeacherAllocationController::class, 'index']);
            // Create
            Route::post('/', [TeacherAllocationController::class, 'store']);
            // Inactive
            Route::get('/inactive', [TeacherAllocationController::class, 'inactive']);
            // Dropdown API
            Route::get('/teachers', [TeacherAllocationController::class, 'teachers']);
            Route::get('/class/{classId}/subjects', [TeacherAllocationController::class, 'classSubjects']);
            // CRUD
            Route::get('/{id}', [TeacherAllocationController::class, 'show']);
            Route::put('/{id}', [TeacherAllocationController::class, 'update']);
            Route::delete('/{id}', [TeacherAllocationController::class, 'destroy']);
            Route::put('/{id}/restore', [TeacherAllocationController::class, 'restore']);
        });

    });

     Route::prefix('employee')->group(function () {
        Route::get('/', [EmployeeController::class, 'index']);
        Route::get('/inactive', [EmployeeController::class, 'inactive']);
        Route::post('/', [EmployeeController::class, 'store']);
        Route::get('/{id}', [EmployeeController::class, 'show']);
        Route::put('/{id}', [EmployeeController::class, 'update']);
        Route::delete('/{id}', [EmployeeController::class, 'destroy']);
        Route::put('/{id}/restore', [EmployeeController::class, 'restore']);
    });

    // Module Management

    Route::prefix('modules')->group(function () {
        Route::get('/', [ModuleController::class, 'index']);
        Route::get('/inactive', [ModuleController::class, 'inactive']);
        Route::post('/', [ModuleController::class, 'store']);
        Route::get('/{id}', [ModuleController::class, 'show']);
        Route::put('/{id}', [ModuleController::class, 'update']);
        Route::delete('/{id}', [ModuleController::class, 'destroy']);
        Route::put('/{id}/restore', [ModuleController::class, 'restore']);
    });

    // Permission Management
    Route::prefix('permissions')->group(function () {
        // Get all permissions
        Route::get('/', [PermissionController::class, 'index']);
    });

    // Role Permission Management
    Route::prefix('roles/{roleId}/permissions')->group(function () {
        // Get permissions assigned to a role
        Route::get('/', [PermissionController::class, 'rolePermissions']);

        // Assign permissions to a role
        Route::put('/', [PermissionController::class, 'assignRolePermissions']);
    });

    Route::prefix('configuration')->group(function () {

         Route::prefix('branches')->group(function () {

            Route::get('/', [BranchController::class, 'index']);
            Route::post('/', [BranchController::class, 'store']);
            Route::get('/inactive', [BranchController::class, 'inactive']);
            Route::get('/{id}', [BranchController::class, 'show']);
            Route::put('/{id}', [BranchController::class, 'update']);
            Route::delete('/{id}', [BranchController::class, 'destroy']);
            Route::put('/{id}/restore', [BranchController::class, 'restore']);

        });

        Route::prefix('asset-categories')->group(function () {
            Route::get('/', [AssetCategoryController::class, 'index']);
            Route::post('/', [AssetCategoryController::class, 'store']);
            Route::get('/inactive', [AssetCategoryController::class, 'inactive']);
            Route::get('/{id}', [AssetCategoryController::class, 'show']);
            Route::put('/{id}', [AssetCategoryController::class, 'update']);
            Route::delete('/{id}', [AssetCategoryController::class, 'destroy']);
            Route::put('/{id}/restore', [AssetCategoryController::class, 'restore']);
        });
        Route::prefix('asset-subcategories')->group(function () {
            Route::get('/', [AssetSubcategoryController::class, 'index']);
            Route::post('/', [AssetSubcategoryController::class, 'store']);
            Route::get('/inactive', [AssetSubcategoryController::class, 'inactive']);
            Route::get('/{id}', [AssetSubcategoryController::class, 'show']);
            Route::put('/{id}', [AssetSubcategoryController::class, 'update']);
            Route::delete('/{id}', [AssetSubcategoryController::class, 'destroy']);
            Route::put('/{id}/restore', [AssetSubcategoryController::class, 'restore']);
        });

        Route::prefix('assets')->group(function () {
            Route::get('/', [AssetController::class, 'index']);
            Route::post('/', [AssetController::class, 'store']);
            Route::get('/inactive', [AssetController::class, 'inactive']);
            Route::get('/{id}', [AssetController::class, 'show']);
            Route::put('/{id}', [AssetController::class, 'update']);
            Route::delete('/{id}', [AssetController::class, 'destroy']);
            Route::put('/{id}/restore', [AssetController::class, 'restore']);
        });
    });


    // Student Management
    Route::prefix('student-management')->group(function () {
        Route::prefix('students')->group(function () {

        Route::get('/', [StudentController::class, 'index']);
        Route::post('/', [StudentController::class, 'store']);

        Route::get('/inactive', [StudentController::class, 'inactive']);
        Route::get('/dropdowns', [StudentController::class, 'dropdowns']);
        Route::get('/search', [StudentController::class, 'search']);

        // IMPORTANT:
        // Specific routes must come BEFORE /{id}

        Route::get('/dashboard', [StudentController::class, 'dashboard']);
        Route::get('/profile', [StudentController::class, 'profile']);

        Route::post('/check-admission-number', [StudentController::class, 'checkAdmissionNumber']);
        Route::post('/check-student-code', [StudentController::class, 'checkStudentCode']);

        Route::get('/class/{classId}', [StudentController::class, 'classStudents']);
        Route::get('/section/{sectionId}', [StudentController::class, 'sectionStudents']);
        Route::get('/sections-by-class/{classId}', [StudentController::class, 'sectionsByClass']);
        Route::get('/subjects', [StudentController::class, 'subjects']);

        // Dynamic {id} routes should come AFTER all fixed routes
        Route::get('/{id}', [StudentController::class, 'show']);
        Route::put('/{id}', [StudentController::class, 'update']);
        Route::delete('/{id}', [StudentController::class, 'destroy']);
        Route::put('/{id}/restore', [StudentController::class, 'restore']);

    });

        Route::prefix('bulk-import')->group(function () {
            Route::get('/download-sample', [StudentBulkImportController::class, 'downloadSample']);
            Route::post('/upload', [StudentBulkImportController::class, 'upload']);
            Route::post('/preview', [StudentBulkImportController::class, 'preview']);
            Route::post('/validate',[StudentBulkImportController::class, 'validate']);
            Route::post('/import', [StudentBulkImportController::class, 'import']);
        });


    });

    // Attendance Management

    Route::prefix('attendance-management')->group(function () {
        // Daily Attendance
        Route::prefix('daily-attendance')->group(function () {
            Route::get('/',[DailyAttendanceController::class, 'index']);
            Route::post('/load-students',[DailyAttendanceController::class, 'loadStudents']);
            Route::post('/store',[DailyAttendanceController::class, 'store']);

            Route::get('/student', [DailyAttendanceController::class, 'studentAttendance']);
            
            Route::get('/show/{id}',[DailyAttendanceController::class, 'show']);
            Route::put('/update/{id}',[DailyAttendanceController::class, 'update']);
            Route::put('/lock/{id}',[DailyAttendanceController::class, 'lockAttendance']);
            Route::put('/unlock/{id}',[DailyAttendanceController::class, 'unlockAttendance']);
            Route::delete('/delete/{id}',[DailyAttendanceController::class, 'destroy']);
            Route::get('/inactive',[DailyAttendanceController::class, 'inactive']);
            Route::put('/restore/{id}',[DailyAttendanceController::class, 'restore']);
        });
        // Attendance Reports
        Route::prefix('reports')->group(function () {
            Route::get('/',[AttendanceReportController::class, 'index']);    
            Route::post('/daily',[AttendanceReportController::class, 'dailyReport']);
            Route::post('/student',[AttendanceReportController::class, 'studentWiseReport']);
            Route::post('/class',[AttendanceReportController::class, 'classWiseReport']);
            Route::post('/monthly',[AttendanceReportController::class, 'monthlyReport']);
            Route::post('/summary',[AttendanceReportController::class, 'attendanceSummary']);
            Route::post('/export-excel',[AttendanceReportController::class, 'exportExcel']);
            Route::post('/export-pdf',[AttendanceReportController::class, 'exportPdf']);
        });
        // Lecture-wise Attendance
        Route::prefix('lecture-attendance')->group(function () {
            Route::get('/index',[LectureAttendanceController::class, 'index']);
            Route::post('/load-students',[LectureAttendanceController::class, 'loadStudents']);
            Route::post('/store',[LectureAttendanceController::class, 'store']);
        });
    });


     Route::prefix('homework-assignments')->group(function () {
        Route::get('/', [HomeworkAssignmentController::class, 'index']);

        Route::get('/student', [HomeworkAssignmentController::class,'studentHomework']);
        Route::get('/student/{id}', [HomeworkAssignmentController::class,'studentHomeworkShow']);

        Route::get('/{id}', [HomeworkAssignmentController::class, 'show']);
        Route::post('/', [HomeworkAssignmentController::class, 'store']);
        Route::put('/{id}', [HomeworkAssignmentController::class, 'update']);
        Route::delete('/{id}', [HomeworkAssignmentController::class, 'destroy']);
        Route::post('/{id}/publish', [HomeworkAssignmentController::class, 'publish']);
        Route::post('/{id}/close', [HomeworkAssignmentController::class, 'close']);
        Route::post('/{id}/activate', [HomeworkAssignmentController::class, 'activate']);
    });

// Homework Submissions

    Route::prefix('homework-submissions')->group(function () {
        Route::get('/',[HomeworkSubmissionController::class,'index']);
        Route::get('/{id}',[HomeworkSubmissionController::class,'show']);
        Route::post('/{homeworkId}/submit',[HomeworkSubmissionController::class,'submit']);
        Route::put('/{homeworkId}/students/{studentId}/status',[HomeworkSubmissionController::class, 'updateStudentStatus']);
    });



    Route::prefix('fees')->group(function () {

        Route::prefix('courses')->group(function () {
            Route::get('/',[CourseController::class, 'index']);
            Route::post('/',[CourseController::class, 'store']);
            Route::get('/{id}',[CourseController::class, 'show']);
            Route::put('/{id}',[CourseController::class, 'update']);
            Route::delete('/{id}',[CourseController::class, 'destroy']);
            Route::put('/{id}/toggle-status',[CourseController::class, 'toggleStatus']);
        });


        Route::prefix('components')->group(function () {
            Route::get('/',[FeeComponentController::class, 'index']);
            Route::post('/',[FeeComponentController::class, 'store']);
            Route::get('/{id}',[FeeComponentController::class, 'show']);
            Route::put('/{id}',[FeeComponentController::class, 'update']);
            Route::delete('/{id}',[FeeComponentController::class, 'destroy']);
            Route::put('/{id}/toggle-status',[FeeComponentController::class, 'toggleStatus']);
        });

        Route::prefix('installments')->group(function () {
            Route::get('/',[InstallmentController::class, 'index']);
            Route::post('/',[InstallmentController::class, 'store']);
            Route::get('/{id}',[InstallmentController::class, 'show']);
            Route::put('/{id}',[InstallmentController::class, 'update']);
            Route::delete('/{id}',[InstallmentController::class, 'destroy']);
            Route::put('/{id}/toggle-status',[InstallmentController::class, 'toggleStatus']);
        });

        Route::prefix('structures')->group(function () {
            Route::get('/',[FeeStructureController::class, 'index']);
            Route::post('/',[FeeStructureController::class, 'store']);
            Route::get('/{id}',[FeeStructureController::class, 'show']);
            Route::put('/{id}',[FeeStructureController::class, 'update']);
            Route::delete('/{id}',[FeeStructureController::class, 'destroy']);
            Route::put('/{id}/toggle-status',[FeeStructureController::class, 'toggleStatus']);
        });


        Route::prefix('payments')->group(function () {
            Route::get('/',[FeePaymentController::class, 'index']);
            Route::get('/students',[FeePaymentController::class, 'students']);
            Route::get('/students/{studentId}',[FeePaymentController::class, 'studentDetails']);
            Route::post('/',[FeePaymentController::class, 'store']);

            Route::get('/my-details', [FeePaymentController::class,'myFeeDetails']);

            Route::get('/{id}',[FeePaymentController::class, 'show']);
        });


        Route::prefix('waivers')->group(function () {
            Route::get('/',[FeeWaiverController::class, 'index']);
            Route::get('/students',[FeeWaiverController::class, 'students']);
            Route::post('/',[FeeWaiverController::class, 'store']);
            Route::get('/{id}',[FeeWaiverController::class, 'show']);
            Route::put('/{id}',[FeeWaiverController::class, 'update']);
            Route::delete('/{id}',[FeeWaiverController::class, 'destroy']);
        });

    });

    Route::prefix('communication')->group(function () {

        Route::prefix('notices')->group(function () {
            Route::get('/', [NoticeController::class, 'index']);
            Route::get('/inactive', [NoticeController::class, 'inactive']);
            Route::post('/', [NoticeController::class, 'store']);
            Route::get('/{id}', [NoticeController::class, 'show']);
            Route::put('/{id}', [NoticeController::class, 'update']);
            Route::delete('/{id}', [NoticeController::class, 'destroy']);
            Route::patch('/{id}/restore', [NoticeController::class, 'restore']);
        });
    });

});