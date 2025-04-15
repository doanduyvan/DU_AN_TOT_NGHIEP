<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Http\Requests\PermissionRequest;
use Illuminate\Database\QueryException;

class PermissionController extends Controller
{
    //
    protected $super_admin;
    public function __construct(){
        $this->super_admin = ['Admin'];
    }
    public function index()
    {
        $filters = request()->only(['per_page', 'sortorder', 'keyword']);
        $permissions = Permission::search($filters['keyword'] ?? null)
        ->applyFilters($filters);
        return response()->json($permissions);
    }
    public function update(PermissionRequest $request, $id){
        $request->validate([
            'name' => 'required|string|max:255',
            'guard_name' => 'required|string|max:255',
        ]);
        $permission = Permission::findOrFail($request->id);
        $permission->name = $request->name;
        $permission->guard_name = $request->guard_name;
        $permission->save();
        return response()->json([
            'permission' => $permission,
            'status' => 200,
        ]);
    }
    public function create(PermissionRequest $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions',
            'guard_name' => 'required|string|max:255',
        ]);

        $permission = Permission::create([
            'name' => $request->name,
            'guard_name' => $request->guard_name,
        ]);
        $superAdminRole = Role::where('name', $this->super_admin)->first();
        if ($superAdminRole) {
            $superAdminRole->permissions()->attach($permission);
        }
        return response()->json([
            'permission' => $permission,
            'status' => 200,
        ]);
    }

    public function show($id)
    {
        $role = Permission::findOrFail($id);
        $role->permissions;
        return response()->json([
            'permission' => $role,
            'status' => 200,
        ]);
    }

    public function destroy(Request $request)
    {
        $ids = $request->ids;
        if (is_array($ids) && !empty($ids)) {
            try {
                Permission::whereIn('id', $ids)->delete();
                return response()->json(['message' => 'Xóa quyền thành công', 'status' => 200]);
            } catch (QueryException $e) {
                return response()->json(['message' => 'Xóa thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
            }
        } else {
            return response()->json(['message' => 'Xóa thất bại', 'status' => 'error'], 400);
        }
    }

}
