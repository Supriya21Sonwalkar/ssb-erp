<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Enquiry;
use App\Models\Course;
use App\Models\GalleryItem;
use App\Models\Media;
use Spatie\Activitylog\Models\Activity;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'enquiries_total' => Enquiry::count(),
            'enquiries_new' => Enquiry::where('status', 'new')->count(),
            'courses' => Course::count(),
            'gallery' => GalleryItem::count(),
            'media' => Media::count(),
        ];

        $recentEnquiries = Enquiry::latest()->take(5)->get();
        $recentActivities = Activity::with('causer')->latest()->take(5)->get();

        return view('admin.dashboard', compact('stats', 'recentEnquiries', 'recentActivities'));
    }
}
