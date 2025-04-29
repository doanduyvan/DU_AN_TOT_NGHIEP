<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

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
    public function getOrderYear(){
        $orders = Order::selectRaw('YEAR(created_at) as year, COUNT(*) as count')
            ->groupBy('year')
            ->orderBy('year', 'desc')
            ->get();
        return response()->json($orders);
    }
    public function getOrderStatistics($year){
        $data = DB::table('orders')
        ->select(DB::raw('YEAR(created_at) as year'),
        DB::raw('MONTH(created_at) as month'),
        DB::raw('COUNT(id) as total_order'),
        DB::raw('SUM(total_amount) as total_revenue'))
        ->where('status', 6)
        ->whereYear('created_at', $year)
        ->groupBy(DB::raw('YEAR(created_at), MONTH(created_at)'))
        ->orderBy('month', 'asc')
        ->get();
        return response()->json($data);
    }
}