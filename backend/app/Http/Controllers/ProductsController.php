<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Database\QueryException;
use App\Http\Requests\ProductRequest;
use App\Http\Requests\ProductImageRequest;
use App\Http\Requests\ProductVariantRequest;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductsController extends Controller
{
    //
    public function index()
    {
        $Products = Product::orderBy('id', 'desc')->get();
        return response()->json($Products);
    }

    public function getProductById($id)
    {
        $product = Product::where('id', $id)->first();
        $product->load('images');
        $variant = $product->variants()->first();
        return response()->json([
            'product' => $product,
            'variant' => $variant,
        ]);
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

    public function update(ProductRequest $productRequest, ProductImageRequest $imageRequest, ProductVariantRequest $variantRequest, $id)
    {
        try {
            $product = Product::findOrFail($id);
            $validateData = $productRequest->validated();
            if ($productRequest->hasFile('avatar')) {
                if ($product->avatar) {
                    Storage::disk('public')->delete($product->avatar);
                }

                $path = $productRequest->file('avatar')->storePublicly('uploads/products', 'public');
                $validateData['avatar'] = $path;
            }
            $product->update($validateData);

            // cap nhat hinh anh san pham neu co
            if ($imageRequest->has('images') || $imageRequest->has('deleted_images')) {
                // Chỉ xóa những hình đã chọn xóa
                if ($imageRequest->has('deleted_images')) {
                    $deletedImageIds = $imageRequest->input('deleted_images');
                    // Xóa từng hình theo ID đã chọn
                    foreach ($deletedImageIds as $imageId) {
                        $image = $product->images()->find($imageId);
                        if ($image) {
                            // Xóa file nếu cần
                            if ($image->img) {
                                Storage::disk('public')->delete($image->img);
                            }
                            // Xóa record trong database
                            $image->delete();
                        }
                    }
                }

                // Lưu các ảnh mới (nếu có)
                if ($imageRequest->has('images')) {
                    foreach ($imageRequest->file('images') as $image) {
                        $imagePath = $image->storePublicly('uploads/products', 'public');
                        $product->images()->create(['img' => $imagePath]);
                    }
                }
            }
            $variants = $variantRequest->validated();
            // Xoá các biến thể cũ (nếu có) và tạo mới

            $product->variants()->update($variants);



            return response()->json([
                'message' => 'Cập nhật sản phẩm thành công',
                'status' => 200,
                'product' => $product,
                'image_url' => asset('storage/' . $product->avatar)
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Cập nhật sản phẩm thất bại: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }

    public function generateUniqueSKU()
    {
        return Str::uuid()->toString(); // Tạo UUID
    }
    public function searchProduct(Request $request)
    {
        $query = $request->input('search_product');
        $products = Product::where('product_name', 'like', '%' . $query . '%')->get();
        $products->load('variants');
        return response()->json($products);
    }
}
