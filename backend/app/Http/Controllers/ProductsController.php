<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Database\QueryException;
use App\Http\Requests\ProductRequest;
use App\Http\Requests\ProductImageRequest;
use App\Http\Requests\ProductVariantRequest;
use Illuminate\Support\Str;

class ProductsController extends Controller
{
    //
    public function index($id = null)
    {
        if ($id !== null) {
            $Product = Product::findOrFail($id);
            return response()->json([
                'Product' => $Product,
            ]);
        }
        $Products = Product::orderBy('id', 'desc')->get();
        return response()->json($Products);
    }

    public function create(ProductRequest $productRequest, ProductImageRequest $imageRequest, ProductVariantRequest $variantRequest)
    {
        try {
            $path = $productRequest->file('avatar')->storePublicly('uploads/products', 'public');
            $validateData = $productRequest->validated();
            $user = auth()->user();
            if (!$user) {
                return response()->json([
                    'message' => 'Người dùng chưa đăng nhập',
                    'status' => 'error'
                ], 401);
            }
            $validateData['user_id'] = $user->id;
            $validateData['avatar'] = $path;
            $Product = Product::create($validateData);
            if ($imageRequest->has('images')) {
                foreach ($imageRequest->file('images') as $image) {
                    $imagePath = $image->storePublicly('uploads/products', 'public');
                    $Product->images()->create(['img' => $imagePath]);
                }
            }

            $variants = $variantRequest->validated();
            $variants['sku'] = $this->generateUniqueSKU();
            $Product->variants()->create($variants);

            return response()->json([
                'message' => 'Thêm sản phẩm thành công',
                'status' => 200,
                'Product' => $Product,
                'image_url' => asset('storage/' . $path)
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Thêm sản phẩm thất bại: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        $ids = $request->ids;
        if (is_array($ids) && !empty($ids)) {
            try {
                Product::whereIn('id', $ids)->delete();
                return response()->json(['message' => 'Xóa sản phẩm thành công', 'status' => 200], 200);
            } catch (QueryException $e) {
                if ($e->getCode() == '23000') {
                    return response()->json(['message' => 'Không thể xóa sản phẩm vì có dữ liệu liên quan', 'status' => 'error'], 400);
                }
                return response()->json(['message' => 'Xóa sản phẩm thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
            }
        } else {
            return response()->json(['message' => 'Xóa sản phẩm thất bại', 'status' => 'error'], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $validateData = $request->validate([
            'category_name' => 'required|string',
            'img' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);
        try {
            $category = Product::findOrFail($id);
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

    public function generateUniqueSKU()
    {
        return Str::uuid()->toString(); // Tạo UUID
    }
}
