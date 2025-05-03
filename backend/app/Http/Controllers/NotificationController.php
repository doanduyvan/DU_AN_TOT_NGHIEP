<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;

class NotificationController extends Controller
{
    public function notificationOrder(){
        $orders = Order::where('status', 1)->count();
        return response()->json($orders);
    }
    public function notificationProduct(){
        $products = Product::whereDoesntHave('variants', function ($query) {
            $query->where('stock_quantity', '>', 0);
        })->get();
        return response()->json($products);
    }
}
