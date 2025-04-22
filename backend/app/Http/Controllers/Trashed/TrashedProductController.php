<?php

namespace App\Http\Controllers\Trashed;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Storage;
use App\Models\Category;

class TrashedProductController extends Controller
{
    public function index()
    {
        $filters = request()->only(['per_page', 'sortorder', 'keyword', 'filter_category']);
        $products = Product::onlyTrashed()->search($filters['keyword'] ?? null)
        ->filterCategory($filters['filter_category'] ?? null)
        ->applyFilters($filters);
        $products->load('user');
        $products->getCollection()->transform(function ($product) {
            $product->user_name = $product->user ? $product->user->fullname : null;
            return $product;
        });
        return response()->json($products);
    }

    public function restore(Request $request)
    {
        $ids = $request->ids;
        if (is_array($ids) && !empty($ids)) {
            try {
                Product::restoreByIds($ids);
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
                $product = Product::onlyTrashed()->find($id);

                if ($product) {
                    $productVariants = $product->variants();
                    if ($productVariants->count() > 0) {
                        $productVariants->delete();
                    }

                    $productImages = $product->images;
                    foreach ($productImages as $image) {
                        if ($image->img) {
                            Storage::disk('public')->delete($image->img);
                        }
                        $image->delete();
                    }
                    if ($product->avatar) {
                        Storage::disk('public')->delete($product->avatar);
                    }
                    $product->forceDelete();
                    return response()->json(['message' => 'Xóa vĩnh viễn thành công', 'status' => 200], 200);
                } else {
                    return response()->json(['message' => 'Sản phẩm không tồn tại', 'status' => 'error'], 404);
                }
            } catch (QueryException $e) {
                return response()->json(['message' => 'Xóa vĩnh viễn thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
            }
        } else {
            return response()->json(['message' => 'Dữ liệu không hợp lệ', 'status' => 'error'], 400);
        }
    }
}
