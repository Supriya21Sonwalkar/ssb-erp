<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Department;

class DepartmentController extends Controller
{
    public function index()
{
    return response()->json(
        Department::where('status', 1)
            ->orderBy('department_name')
            ->get()
    );
}
}
