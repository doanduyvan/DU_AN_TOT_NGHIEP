<?php

namespace App\Http\Controllers\customer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShopController extends Controller
{
    function getCategory(){
        $categories = Category::select('id', 'category_name')->get();
        return response()->json([
            'categories' => $categories
        ]);
    }

    public function getProducts(Request $request)
    {
        $productSelect = ['id', 'avatar', 'product_name', 'rating_avg'];
        $query = Product::with(['variants' => function ($query) {
            $variantSelect = ['id', 'product_id', 'size', 'price', 'promotional_price','sold_quantity'];
            $query->select($variantSelect);
        }])
            ->select($productSelect)
            ->where('status', 1)
            ->whereNull('deleted_at');

        // Lọc danh mục hoặc từ khóa
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        } else if ($request->has('keyword')) {
            $query->where('product_name', 'like', '%' . $request->keyword . '%');
        }

        // lọc theo biến thể
        if ($request->variants && is_array($request->variants)) {
            $query->whereHas('variants', function ($q) use ($request) {
                $q->whereIn('size', $request->variants);
            });
        }


        // sắp sếp
        if ($request->has('sort_by') && in_array($request->sort_by, ['min_price', 'max_price', 'sold_qty', 'new'])) {
            $sortBy = $request->sort_by;
            switch ($sortBy) {
                case 'min_price':
                    $query->sortBy('price_sort', 'asc');
                    break;
                case 'max_price':
                    $query->sortBy('price_sort', 'desc');
                    break;
                case 'sold_qty':
                    $query->sortBy('sold_qty', 'desc');
                    break;
                case 'new':
                    $query->orderBy('created_at', 'desc');
                    break;
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Lọc theo khoảng giá 
        if ($request->has('price_min') || $request->has('price_max')) {
            $query->withPriceMin();
            if ($request->price_min) {
                $query->having('price_min', '>=', $request->price_min);
            }
            if ($request->price_max) {
                $query->having('price_min', '<=', $request->price_max);
            }
        }
    
        // Phân trang
        $perPage = $request->query('limit', 10);
        $products = $query->paginate($perPage);
    
        // Trả dữ liệu
        return response()->json([
            'current_page'   => $products->currentPage(),
            'last_page'      => $products->lastPage(),
            'total'          => $products->total(),
            'data'           => $products->items()
        ]);
    }

    function getVariantFilter(){
        $variants = ProductVariant::select('size')->distinct()->pluck('size');
        return response()->json([
            'variants' => $variants
        ]);
    }

    public function searchSuggest(Request $request)
    {
        $keyword = $request->query('keyword');
        if (!$keyword) {
            return response()->json(['products' => []]);
        }
        $productSelect = ['id', 'avatar', 'product_name'];
        $variantSelect = ['id', 'product_id', 'price', 'promotional_price'];

        $products = Product::where('product_name', 'like', "%$keyword%")
            ->where('status', 1)
            ->whereNull('deleted_at')
            ->with(['variants' => function ($query) use ($variantSelect) {
                $query->select($variantSelect);
            }])
            ->select($productSelect)
            ->limit(15)
            ->get();

        return response()->json(['products' => $products]);
    }
    

}
