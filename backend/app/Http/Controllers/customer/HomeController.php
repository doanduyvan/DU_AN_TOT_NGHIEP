<?php

namespace App\Http\Controllers\customer;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Category;
use App\Models\News;
use App\Models\Product;
use Illuminate\Http\Request;

class HomeController extends Controller
{
 

    public function getNewProducts()
    {

        $productSelect = ['id', 'avatar', 'product_name', 'rating_avg','total_reviews'];
        $newProducts = Product::where('status', 1)
            ->whereNull('deleted_at')
            ->with(['variants' => function ($query) {
                $variantSelect = ['id', 'product_id', 'size', 'price', 'promotional_price','sold_quantity'];
                $query->select($variantSelect);
            }])
            ->select($productSelect)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
    
        return response()->json([
            'newProducts' => $newProducts
        ], 200);
    }

    public function getBestSellingProducts()
    {
        $productSelect = ['id', 'avatar', 'product_name', 'rating_avg','total_reviews'];
        $bestSellingProducts = Product::where('status', 1)
            ->whereNull('deleted_at')
            ->with(['variants' => function ($query) {
                $variantSelect = ['id', 'product_id', 'size', 'price', 'promotional_price','sold_quantity'];
                $query->select($variantSelect);
            }])
            ->select($productSelect)
            ->sortBy('sold_qty', 'desc')
            ->limit(10)
            ->get();
    
        return response()->json([
            'bestSellingProducts' => $bestSellingProducts
        ], 200);
    }

    public function getCategory(){
        $categories = Category::select('id', 'category_name', 'img')
            ->get();

        return response()->json([
            'categories' => $categories
        ], 200);
    }

    public function get3News(){
        $news = News::select('id', 'title', 'avatar')
            ->whereNull('deleted_at')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        return response()->json([
            'news' => $news
        ], 200);
    }

    public function getBanner(){
        $banners = Banner::select('id', 'img', 'link')
            ->whereNull('deleted_at')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json([
            'banners' => $banners
        ], 200);
    }
}
