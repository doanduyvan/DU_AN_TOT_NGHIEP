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
    public function getBannerById($id)
    {

        $banners = Banner::find($id);
        if (!$banners) {
            return response()->json([
                'message' => 'Banner không tồn tại',
                'status' => 404,
            ], 404);
        }
        return response()->json($banners);
    }
    public function create(BannerRequest $request)
    {
        try {
            $path = $request->file('img')->storePublicly('uploads/banners', 'public');
            $validateData = $request->validated();
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
                $banners = Banner::whereIn('id', $ids)->get();
                foreach ($banners as $banner) {
                    if ($banner->img) {
                        Storage::disk('public')->delete($banner->img);
                    }
                }
                Banner::whereIn('id', $ids)->delete();
                return response()->json(['message' => 'Xóa banner thành công', 'status' => 200], 200);
            } catch (QueryException $e) {
                return response()->json(['message' => 'Xóa banner thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
            }
        } else {
            return response()->json(['message' => 'Xóa banner thất bại', 'status' => 'error'], 400);
        }
    }
    public function update(BannerRequest $request, $id)
    {
        $validatedData = $request->validated();

        try {
            $banner = Banner::findOrFail($id);
            if ($request->hasFile('img')) {
                if ($banner->img) {
                    $oldImagePath = public_path('storage/' . $banner->img);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }
                $path = $request->file('img')->storePublicly('uploads', 'public');
                $validatedData['img'] = $path;
            } else {
                $validatedData['img'] = $banner->img;
            }
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
            return response()->json([
                'message' => 'Đã xảy ra lỗi không xác định.',
                'status' => 'error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
