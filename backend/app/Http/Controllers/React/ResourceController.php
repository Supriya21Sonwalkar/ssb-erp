<?php

namespace App\Http\Controllers\React;

use App\Http\Controllers\Controller;
use App\Models\Resource;

class ResourceController extends Controller
{
    public function index()
    {
        $resources = Resource::where('is_active',1)
            ->orderBy('order_number')
            ->get()
            ->map(function ($resource) {

                return [

                    'id' => $resource->id,

                    'title' => $resource->title,

                    'category' => $resource->category,

                    'download_count' => $resource->download_count,

                    'is_new' => $resource->is_new,

                    'download_url' => route(
                        'resources.download',
                        $resource->id
                    ),

                ];

            });

        return response()->json([
            'resources' => $resources,
        ]);
    }
}