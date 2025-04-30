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
        // $newProducts = Product::select('id', 'avatar', 'product_name', 'rating_avg')
        //     ->where('status', 1)
        //     ->with(['variants' => function ($query) {
        //         $query->select('id','product_id', 'price', 'promotional_price', 'sold_quantity');
        //     }])
        //     ->orderBy('created_at', 'desc')
        //     ->take(10)
        //     ->get();

        // foreach ($newProducts as $product) {
        //     $product->total_sold = $product->variants->sum('sold_quantity');
        //     $product->cheapest_variant = $product->variants->sortBy('price')->first();
        //     unset($product->variants);
        // }


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
