<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('id', 'desc')->get();
        return response()->json($users);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->delete();
            return response()->json(['message' => 'Xóa người dùng thành công', 'status' => 200], 200);
        }
        return response()->json(['message' => 'Không tìm thấy người dùng', 'status' => 404], 404);
    }
    public function updateStatus(request $request)
    {
        $validatedData = $request->validate([
            'status' => 'required',
        ]);
        $id = $request->id;
        $posts = User::where('id', $id);
        $data = $validatedData['status'];
        $posts->update(['status' => $data]);
        return response()->json(['message' => 'Cập nhật trạng thái thành công', 'status' => 200], 200);
    }
    public function updateUser(Request $request, $id)
    {
        $validatedData = $request->validate([
            'roles' => 'required|array',
        ]);
        try {
            $user = User::findOrFail($id);
            if ($user) {
                if (isset($validatedData['roles']) && is_array($validatedData['roles'])) {
                    $roles = Role::whereIn('id', $validatedData['roles'])
                        ->where('guard_name', 'api')
                        ->get();
                    $user->syncRoles($roles);
                    return response()->json(['message' => 'Cập nhập thành công thành công', 'status' => 200], 200);
                }
                return response()->json(['message' => 'Không có vai trò để cập nhật', 'status' => 400], 400);
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Không tìm thấy người dùng',
                'status' => 404,
                'error' => $e->getMessage(),
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra',
                'status' => 500,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getUserById($id)
    {

        $user = User::find($id);
        if ($user) {
            $user->load('roles');
            return response()->json($user);
        }
        return response()->json(['message' => 'Không tìm thấy người dùng', 'status' => 404], 404);
    }
    public function showRoles()
    {
        $roles = Role::orderBy('id', 'desc')->get();
        return response()->json([
            'roles' => $roles,
            'status' => 200,
        ]);
    }

    public function searchUser(Request $request)
    {
        $query = $request->input('search_user');
        $user = User::where('email', 'like', '%' . $query . '%')->get();

        return response()->json($user);
    }
}
