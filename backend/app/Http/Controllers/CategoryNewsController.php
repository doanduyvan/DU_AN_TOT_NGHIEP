<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CategoryNews;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Storage;

class CategoryNewsController extends Controller
{
    //
    public function index()
    {
        $categories = CategoryNews::orderBy('id', 'desc')->get();
        return response()->json($categories);
    }
    public function getCategoyById($id)
    {
        $category = CategoryNews::findOrFail($id);
        return response()->json([
            'category' => $category
        ]);
    }
    public function create(Request $request)
    {
        $validateData = $request->validate([
            'category_news_name' => 'required|string',
            'img' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);
        try {
            $path = $request->file('img')->storePublicly('uploads', 'public');
            $validateData['img'] = $path;
            $category = CategoryNews::create($validateData);
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
                $categories = CategoryNews::whereIn('id', $ids)->get();
                foreach ($categories as $category) {
                    if ($category->img) {
                        Storage::disk('public')->delete($category->img);
                    }
                }
                CategoryNews::whereIn('id', $ids)->delete();
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
    
    public function update(Request $request, $id)
    {
        $validateData = $request->validate([
            'category_news_name' => 'required|string',
            'img' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);
        try {
            $category = CategoryNews::findOrFail($id);
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
