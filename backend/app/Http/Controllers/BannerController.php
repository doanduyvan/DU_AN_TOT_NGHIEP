<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Banner;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\BannerRequest;

class BannerController extends Controller
{
    public function index()
    {
        $filters = request()->only(['per_page', 'sortorder']);
        $banners = Banner::applyFilters($filters);
        return response()->json($banners);
    }
    public function create(BannerRequest $request)
    {
        $validateData = $request->validated();
        try {
            $path = $request->file('img')->storePublicly('uploads/banners', 'public');
            $validateData['img'] = $path;
            $category = Banner::create($validateData);
            return response()->json([
                'message' => 'Thêm banner thành công',
                'status' => 201,
                'category' => $category,
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Thêm banner thất bại: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        $ids = $request->ids;
        if (is_array($ids) && !empty($ids)) {
            try {
                $categories = Banner::whereIn('id', $ids)->get();
                foreach ($categories as $category) {
                    if ($category->img) {
                        Storage::disk('public')->delete($category->img);
                    }
                }
                Banner::whereIn('id', $ids)->delete();
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
        $validatedData = $request->validated();
    
        try {
            $banner = Banner::findOrFail($id);
            $banner->update($validatedData);
            return response()->json([
                'message' => 'Cập nhật banner thành công',
                'status' => 200,
                'banner' => $banner,
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Cập nhật voucher thất bại. Vui lòng thử lại sau.',
                'status' => 'error',
                'error' => $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            // Xử lý các lỗi khác
            return response()->json([
                'message' => 'Đã xảy ra lỗi không xác định.',
                'status' => 'error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
