<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Database\QueryException;
class OrderController extends Controller
{
    //
    public function index (){
        $orders = Order::orderBy('id', 'desc')->get();
        return response()->json($orders);
    }
    public function getOrderById ($id){
        $order = Order::with('orderDetails.productvariant.product')->find($id);
        return response()->json($order);
    }
    public function update(Request $request, $id){
        $validateData = $request->validate([
            'status' => 'required|numeric',
            'payment_status' => 'required|numeric',
        ]);
        try{
            $order = Order::find( $id);
            $order->status = $request->status;
            $order->payment_status = $request->payment_status;
            $order->update($validateData);
            return response()->json([
                'message' => 'Cập nhật đơn hàng thành công',
                'status' => 200,
                'order' => $order
            ], 200);
        }catch(QueryException $e){
            return response()->json([
                'message' => 'Cập nhật đơn hàng thất bại: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }
}
