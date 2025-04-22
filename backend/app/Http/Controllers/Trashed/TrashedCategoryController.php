<?php

namespace App\Http\Controllers\Trashed;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Storage;

class TrashedCategoryController extends Controller
{
    public function index()
    {
        $filters = request()->only(['per_page', 'sortorder', 'keyword']);
        $categories = Category::onlyTrashed()->search($filters['keyword'] ?? null)
            ->applyFilters($filters);
        return response()->json($categories);
    }

    public function restore(Request $request)
    {
        $ids = $request->ids;
        if (is_array($ids) && !empty($ids)) {
            try {
                Category::restoreByIds($ids);
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
            $category = Category::onlyTrashed()->find($id);
            
            if ($category) {
                if ($category->img) {
                    Storage::disk('public')->delete($category->img);
                }
                $category->forceDelete();
                return response()->json(['message' => 'Xóa vĩnh viễn thành công', 'status' => 200], 200);
            } else {
                return response()->json(['message' => 'Danh mục không tồn tại', 'status' => 'error'], 404);
            }
        } catch (QueryException $e) {
            if ($e->getCode() == '23000') {
                return response()->json(['message' => 'Không thể xóa danh mục vì có dữ liệu liên quan', 'status' => 'error'], 400);
            }
            return response()->json(['message' => 'Xóa vĩnh viễn thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
        }
    } else {
        return response()->json(['message' => 'Dữ liệu không hợp lệ', 'status' => 'error'], 400);
    }
}

}
