<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Database\QueryException;
use App\Http\Requests\ProductRequest;
use App\Http\Requests\ProductImageRequest;
use App\Http\Requests\ProductVariantRequest;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;



class ProductsController extends Controller
{
    //
    public function index()
    {
        $filters = request()->only(['per_page', 'sortorder', 'keyword', 'filter_category']);
        $products = Product::search($filters['keyword'] ?? null)
        ->filterCategory($filters['filter_category'] ?? null)
        ->applyFilters($filters);
        $products->load('user');
        $products->getCollection()->transform(function ($product) {
            $product->user_name = $product->user ? $product->user->fullname : null;
            return $product;
        });
        return response()->json($products);
    }
    
    public function getProductCount(){
        $productCount = Product::count();
        return response()->json([
            'count' => $productCount,
            'status' => 200
        ]);
    }

    public function getProductById($id)
    {
        $product = Product::where('id', $id)->first();
        $product->load('images');
        $variant = $product->variants()->get();
        return response()->json([
            'product' => $product,
            'variant' => $variant,
        ]);
    }

    public function getAllCategories()
    {
        $categories = Category::withTrashed()->orderBy('id', 'desc')->get();
        return response()->json($categories);
    }

    public function create(ProductRequest $productRequest, ProductImageRequest $imageRequest, ProductVariantRequest $variantRequest)
    {
        db::beginTransaction();
        try {
            $path = $productRequest->file('avatar')->storePublicly('uploads/products', 'public');
            $validateData = $productRequest->validated();
            $user = auth()->user();
            if (!$user) {
                DB::rollBack();
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
            if (!is_array($variants) || empty($variants)) {
                throw new \Exception('Dữ liệu biến thể không hợp lệ');
            }
            foreach ($variants as $variantList) {
                foreach ($variantList as $variant) {
                    $existingVariant = ProductVariant::where('product_id', $Product->id)
                        ->where('size', $variant['size'])
                        ->first();
                    $existingVariantSku = ProductVariant::where('sku', $variant['sku'])
                        ->first();
                    if ($existingVariant) {
                        DB::rollBack();
                        return response()->json([
                            'message' => "Size {$variant['size']} đã có. Vui lòng chọn size khác",
                            'existing_variant' => $existingVariant
                        ], 400);
                    }
                    if ($existingVariantSku) {
                        DB::rollBack();
                        return response()->json([
                            'message' => "Mã sản phâm {$variant['sku']} đã tồn tại. Vui lòng nhập mã sản phẩm khác",
                            'existing_variant' => $existingVariant
                        ], 400);
                    }
                    $Product->variants()->create($variant);
                }
            }
            db::commit();
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
                foreach ($ids as $id) {
                    $product = Product::find($id);

                    if ($product && $product->comment()->count() > 0) {
                        return response()->json(['message' => 'Không thể xóa sản phẩm vì có bình luận liên quan', 'status' => 'error'], 400);
                    }
                }

                // Nếu không có biến thể liên quan, tiến hành xóa sản phẩm
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
        DB::beginTransaction();
        try {
            $product = Product::findOrFail($id);
            $validateData = $productRequest->validated();

            // Xử lý avatar (nếu có)
            if ($productRequest->hasFile('avatar')) {
                if ($product->avatar) {
                    Storage::disk('public')->delete($product->avatar);
                }

                $path = $productRequest->file('avatar')->storePublicly('uploads/products', 'public');
                $validateData['avatar'] = $path;
            }
            $product->update($validateData);

            // Cập nhật hình ảnh sản phẩm
            if ($imageRequest->has('images') || $imageRequest->has('deleted_images')) {
                // Xóa các hình ảnh đã chọn xóa
                if ($imageRequest->has('deleted_images')) {
                    $deletedImageIds = $imageRequest->input('deleted_images');
                    foreach ($deletedImageIds as $imageId) {
                        $image = $product->images()->find($imageId);
                        if ($image) {
                            if ($image->img) {
                                Storage::disk('public')->delete($image->img);
                            }
                            $image->delete();
                        }
                    }
                }
                // Lưu các hình ảnh mới (nếu có)
                if ($imageRequest->has('images')) {
                    foreach ($imageRequest->file('images') as $image) {
                        $imagePath = $image->storePublicly('uploads/products', 'public');
                        $product->images()->create(['img' => $imagePath]);
                    }
                }
            }
            // Kiểm tra và xử lý biến thể sản phẩm
            $variants = $variantRequest->validated();
            if (isset($variants['promotional_price']) && $variants['promotional_price'] === null) {
                unset($variants['promotional_price']);
            }
            if (!is_array($variants) || empty($variants)) {
                throw new \Exception('Dữ liệu biến thể không hợp lệ');
            }

            if ($variantRequest->has('deleted_variants')) {
                $deletedVariants = $variantRequest->input('deleted_variants');
                foreach ($deletedVariants as $variantId) {
                    $variant = $product->variants()->find($variantId);
                    if ($variant) {
                        try {
                            $variant->delete();
                        } catch (QueryException $e) {
                            if ($e->getCode() == 23000) {
                                DB::rollBack();
                                return response()->json(['message' => 'Không thể xóa vì biến thể này đã được sử dụng trong đơn hàng.'], 400);
                            }
                            DB::rollBack();
                            return response()->json(['message' => 'Đã có lỗi xảy ra, vui lòng thử lại.'], 500);
                        }
                    }
                }
            }

            // Xử lý thêm mới hoặc cập nhật biến thể
            foreach ($variants as $variantList) {
                foreach ($variantList as $variant) {
                    $existingVariant = $product->variants()->where('product_id', $product->id)
                        ->where('size', $variant['size'])
                        ->where('id', '!=', $variant['id'] ?? null)  // Bỏ qua id của biến thể đang cập nhật
                        ->first();

                    $existingVariantSku = ProductVariant::where('sku', $variant['sku'])
                        ->where('id', '!=', $variant['id'] ?? null)
                        ->lockForUpdate() // Khóa bản ghi để tránh race condition
                        ->first();

                    // Kiểm tra nếu size hoặc mã sản phẩm đã tồn tại
                    if ($existingVariant) {
                        DB::rollBack();
                        return response()->json([
                            'message' => "Size {$variant['size']} đã có. vui lòng chọn size khác",
                            'existing_variant' => $existingVariant
                        ], 400);
                    }

                    if ($existingVariantSku) {
                        DB::rollBack();
                        return response()->json([
                            'message' => "Mã sản phẩm: {$variant['sku']} đã tồn tại. Vui lòng nhập mã sản phẩm khác",
                            'existing_variant' => $existingVariantSku
                        ], 400);
                    }

                    // Cập nhật hoặc thêm mới biến thể
                    if (isset($variant['id'])) {
                        $existingVariant = $product->variants()->find($variant['id']);
                        if ($existingVariant) {
                            $existingVariant->update($variant);
                        }
                    } else {
                        $product->variants()->create($variant);
                    }
                }
            }
            DB::commit();
            return response()->json([
                'message' => 'Cập nhật sản phẩm thành công',
                'status' => 200,
                'product' => $product,
                'image_url' => asset('storage/' . $product->avatar)
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Cập nhật sản phẩm thất bại: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }


    public function searchVariantProduct(Request $request)
    {
        $query = $request->input('search_product');
        $products = Product::whereHas('variants', function ($queryBuilder) use ($query) {
            $queryBuilder->where('sku', 'like', '%' . $query . '%');
        })->get();
        $products->load('variants');
        return response()->json($products);
    }
}
