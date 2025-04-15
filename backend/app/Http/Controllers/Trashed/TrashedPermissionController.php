<?php

namespace App\Http\Controllers\Trashed;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Permission;

use Illuminate\Database\QueryException;
class TrashedPermissionController extends Controller
{
    public function index(){
        $filters = request()->only(['per_page', 'sortorder', 'keyword']);
        $categories = Permission::onlyTrashed()->search($filters['keyword'] ?? null)
        ->applyFilters($filters);
        return response()->json($categories);
    }

    public function restore(Request $request)
    {
        $ids = $request->ids;
        if (is_array($ids) && !empty($ids)) {
            try {
                Permission::restoreByIds($ids);
                return response()->json(['message' => 'Khôi phục dữ liệu thành công', 'status' => 200], 200);
            } catch (QueryException $e) {
                return response()->json(['message' => 'Khôi phục thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
            }
        } else {
            return response()->json(['message' => 'Dữ liệu không hợp lệ', 'status' => 'error'], 400);
        }
    }
    public function forceDelete($id)
    {
        if (!empty($id) && is_numeric($id)) {
            try {
                Permission::forceDeleteId($id);
                return response()->json(['message' => 'Xóa vĩnh viễn thành công', 'status' => 200], 200);
            } catch (QueryException $e) {
                return response()->json(['message' => 'Xóa vĩnh viễn thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
            }
        } else {
            return response()->json(['message' => 'Dữ liệu không hợp lệ', 'status' => 'error'], 400);
        }
    }
}
