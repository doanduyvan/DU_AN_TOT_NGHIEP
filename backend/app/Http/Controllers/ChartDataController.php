<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;

class ChartDataController extends Controller
{
    public function getProductPerformance()
    {
        $categories = Category::with(['products', 'products.variants'])->get();

        $chartData = $categories->map(function($category) {
            $products = $category->products;
            $productCount = $products->count();
            $totalReviews = $products->sum('total_reviews');
            $avgRating = $products->avg('rating_avg');
            $reviewPerProduct = $productCount > 0 ? $totalReviews / $productCount : 0;

            return [
                'category' => $category->category_name,
                'productCount' => $productCount,
                'avgRating' => round($avgRating, 2),
                'totalReviews' => $totalReviews,
                'reviewPerProduct' => floor($reviewPerProduct),
            ];
        });

        return response()->json($chartData);
    }
}