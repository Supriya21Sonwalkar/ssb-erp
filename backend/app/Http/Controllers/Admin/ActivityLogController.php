<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Spatie\Activitylog\Models\Activity;
use Illuminate\Support\Facades\Gate;

class ActivityLogController extends Controller
{
    public function index()
    {
        Gate::authorize('manage-users');
        $activities = Activity::with(['causer', 'subject'])->latest()->paginate(50);
        return view('admin.activity.index', compact('activities'));
    }
}
