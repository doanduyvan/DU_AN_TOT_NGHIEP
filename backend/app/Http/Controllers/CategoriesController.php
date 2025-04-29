<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\QueryException;
use App\Http\Requests\CategoryRequest;

class CategoriesController extends Controller
{
    //
    public function index()
    {
        $filters = request()->only(['per_page', 'sortorder', 'keyword']);
        $categories = Category::search($filters['keyword'] ?? null)
        ->applyFilters($filters);
        return response()->json($categories);
    }

    public function getCategoyById($id)
    {
        $category = Category::findOrFail($id);
        return response()->json([
            'category' => $category
        ]);
    }
    public function create(CategoryRequest $request)
    {
        $validateData = $request->validated();
        try {
            $path = $request->file('img')->storePublicly('uploads', 'public');
            $validateData['img'] = $path;
            $category = Category::create($validateData);
            return response()->json([
                'message' => 'Thêm danh mục thành công',
                'status' => 200,
                'category' => $category,
                'image_url' => asset('storage/' . $path)
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Thêm danh mục thất bại: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        $ids = $request->ids;
        if (is_array($ids) && !empty($ids)) {
            try {
                foreach ($ids as $id) {
                    $category = Category::find($id);

                    if ($category && $category->products()->count() > 0) {
                        return response()->json(['message' => 'Không thể xóa danh mục vì có sản phẩm liên quan', 'status' => 'error'], 400);
                    }
                }
                Category::whereIn('id', $ids)->delete();
                return response()->json(['message' => 'Xóa Danh Mục thành công', 'status' => 200], 200);
            } catch (QueryException $e) {
                if ($e->getCode() == '23000') {
                    return response()->json(['message' => 'Không thể xóa danh mục vì có dữ liệu liên quan', 'status' => 'error'], 400);
                }
                return response()->json(['message' => 'Xóa danh mục thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
            }
        } else {
            return response()->json(['message' => 'Xóa danh mục thất bại', 'status' => 'error'], 400);
        }
    }

    public function update(CategoryRequest $request, $id)
    {
        $validateData = $request->validated();
        try {
            $category = Category::findOrFail($id);
            if ($request->hasFile('img')) {
                if ($category->img) {
                    $oldImagePath = public_path('storage/' . $category->img);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }
                $path = $request->file('img')->storePublicly('uploads', 'public');
                $validateData['img'] = $path;
            } else {
                $validateData['img'] = $category->img;
            }
            $category->update($validateData);
            return response()->json([
                'message' => 'Cập nhật danh mục thành công',
                'status' => 200,
                'category' => $category,
                'image_url' => asset('storage/' . $category->img)
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Cập nhật danh mục thất bại: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }
}
