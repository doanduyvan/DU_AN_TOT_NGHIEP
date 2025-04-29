<?php

namespace App\Http\Controllers\Trashed;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Database\QueryException;

class TrashedOrderController extends Controller
{
    public function index(){
        $filters = request()->only(['per_page', 'sortorder', 'keyword', 'filter_status', 'filter_payment_status', 'filter_shipping_status']);
        $orders = Order::onlyTrashed()->search($filters['keyword'] ?? null)
        ->filterStatus($filters ?? null)
        ->applyFilters($filters);
        $orders->load('user');
        $orders->getCollection()->transform(function ($order) {
            $order->user_name = $order->user ? $order->user->fullname : null;
            return $order;
        });
        return response()->json($orders);
    }

    public function getOrderTrashById($id)
    {
        $order = Order::onlyTrashed()->with('orderDetails.productvariant.product')->find($id);
        return response()->json($order);
    }

    public function restore(Request $request)
    {
        $ids = $request->ids;
        if (is_array($ids) && !empty($ids)) {
            try {
                Order::restoreByIds($ids);
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
                Order::forceDeleteId($id);
                return response()->json(['message' => 'Xóa vĩnh viễn thành công', 'status' => 200], 200);
            } catch (QueryException $e) {
                return response()->json(['message' => 'Xóa vĩnh viễn thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
            }
        } else {
            return response()->json(['message' => 'Dữ liệu không hợp lệ', 'status' => 'error'], 400);
        }
    }
}
