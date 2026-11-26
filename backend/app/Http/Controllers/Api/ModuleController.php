<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ModuleController extends Controller
{
    /**
     * Display active modules.
     */
    public function index()
    {
        $modules = Module::where('status', 1)
            ->orderBy('display_order')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $modules
        ]);
    }

    /**
     * Display inactive modules.
     */
    public function inactive()
    {
        $modules = Module::where('status', 0)
            ->orderBy('display_order')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $modules
        ]);
    }

    /**
     * Store module.
     */
    public function store(Request $request)
    {
        $request->validate([
            'module_name' => 'required|string|max:255|unique:modules,module_name',
            'module_icon' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'display_order' => 'required|integer',
            'status' => 'required|boolean',
        ]);

        $module = Module::create([
            'module_name'   => $request->module_name,
            'module_slug'   => Str::slug($request->module_name),
            'module_icon'   => $request->module_icon,
            'description'   => $request->description,
            'display_order' => $request->display_order,
            'status'        => $request->status,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Module created successfully.',
            'data' => $module,
        ], 201);
    }

    /**
     * Show module.
     */
    public function show($id)
    {
        $module = Module::find($id);

        if (!$module) {
            return response()->json([
                'status' => false,
                'message' => 'Module not found.'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $module
        ]);
    }

    /**
     * Update module.
     */
    public function update(Request $request, $id)
    {
        $module = Module::find($id);

        if (!$module) {
            return response()->json([
                'status' => false,
                'message' => 'Module not found.'
            ], 404);
        }

        $request->validate([
            'module_name' => 'required|string|max:255|unique:modules,module_name,' . $module->id,
            'module_icon' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'display_order' => 'required|integer',
            'status' => 'required|boolean',
        ]);

        $module->update([
            'module_name'   => $request->module_name,
            'module_slug'   => Str::slug($request->module_name),
            'module_icon'   => $request->module_icon,
            'description'   => $request->description,
            'display_order' => $request->display_order,
            'status'        => $request->status,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Module updated successfully.',
            'data' => $module,
        ]);
    }

    /**
     * Soft Delete Module.
     */
    public function destroy($id)
    {
        $module = Module::find($id);

        if (!$module) {
            return response()->json([
                'status' => false,
                'message' => 'Module not found.'
            ], 404);
        }

        $module->update([
            'status' => 0
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Module moved to inactive successfully.'
        ]);
    }

    /**
     * Restore Module.
     */
    public function restore($id)
    {
        $module = Module::find($id);

        if (!$module) {
            return response()->json([
                'status' => false,
                'message' => 'Module not found.'
            ], 404);
        }

        $module->update([
            'status' => 1
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Module restored successfully.'
        ]);
    }
}