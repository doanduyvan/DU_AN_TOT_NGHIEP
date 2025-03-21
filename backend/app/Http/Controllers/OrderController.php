<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;
class OrderController extends Controller
{
    //
    public function index (){
        $orders = Order::orderBy('id', 'desc')->get();
        return response()->json($orders);
    }
    public function getOrderById ($id){
        $order = Order::with('orderDetails.productvariant')->find($id);
        return response()->json($order);
    }
}
