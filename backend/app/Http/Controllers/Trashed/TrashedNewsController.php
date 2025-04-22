<?php

namespace App\Http\Controllers\Trashed;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\News;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Storage;

class TrashedNewsController extends Controller
{
    public function index()
    {
        $filters = request()->only(['per_page', 'sortorder', 'keyword', 'filter_category']);
        $news = News::onlyTrashed()->search($filters['keyword'] ?? null)
        ->filterCategory($filters['filter_category'] ?? null)
        ->applyFilters($filters);
        $news->load('user');
        $news->getCollection()->transform(function ($item) {
            $item->user_name = $item->user ? $item->user->fullname : null;
            return $item;
        });
        return response()->json($news);
    }

    public function restore(Request $request)
    {
        $ids = $request->ids;
        if (is_array($ids) && !empty($ids)) {
            try {
                News::restoreByIds($ids);
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
                $news = News::onlyTrashed()->find($id);
            if ($news) {
                if ($news->avatar) {
                    Storage::disk('public')->delete($news->avatar);
                }
                $news->forceDelete();
                return response()->json(['message' => 'Xóa vĩnh viễn thành công', 'status' => 200], 200);
            } else {
                return response()->json(['message' => 'Danh mục không tồn tại', 'status' => 'error'], 404);
            }
            } catch (QueryException $e) {
                return response()->json(['message' => 'Xóa vĩnh viễn thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
            }
        } else {
            return response()->json(['message' => 'Dữ liệu không hợp lệ', 'status' => 'error'], 400);
        }
    }
}
