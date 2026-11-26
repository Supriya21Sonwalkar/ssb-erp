<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Designation;

class DesignationController extends Controller
{
    public function index()
    {
        return response()->json(
            Designation::where('status', 1)
                ->orderBy('designation_name')
                ->get()
        );
    }
}
