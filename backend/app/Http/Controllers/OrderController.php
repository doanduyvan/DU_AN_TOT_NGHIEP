<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use App\Models\ProductVariant;
use App\Http\Requests\CreateOrderRequest;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\Category;
use App\Models\OrderPayment;

class OrderController extends Controller
{
    //
    public function index()
    {
        $filters = request()->only(['per_page', 'sortorder', 'keyword', 'filter_status', 'filter_payment_status', 'filter_shipping_status']);
        $orders = Order::search($filters['keyword'] ?? null)
            ->filterStatus($filters ?? null)
            ->applyFilters($filters);
        $orders->load('user');
        $orders->getCollection()->transform(function ($order) {
            $order->user_name = $order->user ? $order->user->fullname : null;
            return $order;
        });
        return response()->json($orders);
    }
    public function getOrderLimit()
    {
        $orders = Order::with('orderDetails.productvariant')
            ->orderBy('id', 'desc')->limit(5)->get();
        return response()->json($orders);
    }
    public function getOrderCount()
    {
        $orders = Order::count();
        return response()->json([
            'count' => $orders,
            'status' => 200,
        ], 200);
    }
    public function getOrderById($id)
    {
        $order = Order::with('orderDetails.productvariant.product')->find($id);
        return response()->json($order);
    }

    public function getOrderPayment($id)
    {
        $order = OrderPayment::where('order_id', $id)->get();
        return response()->json([
            'order' => $order,
            'status' => 200,
        ], 200);
    }
    public function getProductVariant()
    {
        $filters = request()->only(['per_page', 'sortorder', 'keyword', 'filter_category']);
        $products = Product::search($filters['keyword'] ?? null)
            ->filterCategory($filters['filter_category'] ?? null)
            ->applyFilters($filters);
        $products->load('variants');
        return response()->json($products);
    }

    public function getCategoryProducts()
    {
        $categories = Category::orderBy('created_at', 'desc')->get();
        return response()->json($categories);
    }

    public function create(CreateOrderRequest $request)
    {
        $validateData = $request->validated();
        // $orderNumber = strtoupper('ORD' . time() . rand(1000, 9999));
        // // Kiểm tra xem mã đơn hàng đã tồn tại trong cơ sở dữ liệu chưa
        // while (Order::where('tracking_number', $orderNumber)->exists()) {
        //     // Nếu mã trùng, tạo lại mã đơn hàng
        //     $orderNumber = strtoupper('ORD' . time() . rand(1000, 9999));
        // }
        // $validateData['tracking_number'] = $orderNumber;
        $validateData['created_by_admin'] = 1;
        DB::beginTransaction();
        try {
            $user = auth()->user();
            if (!$user) {
                return response()->json(['message' => 'Người dùng chưa đăng nhập', 'status' => 'error'], 401);
            }
            $totalAmount = collect($validateData['order_details'])->reduce(function ($total, $item) {
                return $total + $item['price'] * $item['quantity'];
            }, 0);
            if (isset($validateData['shipping_fee'])) {
                $totalAmount += $validateData['shipping_fee'];
            }
            $validateData['total_amount'] = $totalAmount;
            $validateData['user_id'] = $user->id;
            $order = Order::create($validateData);
            foreach ($validateData['order_details'] as $detail) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_variant_id' => $detail['product_variant_id'],
                    'quantity' => $detail['quantity'],
                    'price' => $detail['price'],
                ]);
            }

            DB::commit();
            return response()->json([
                'message' => 'Tạo đơn hàng thành công',
                'status' => 200,
                'order' => $order
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Tạo đơn hàng thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
        }
    }
    public function destroy(Request $request)
    {
        DB::beginTransaction();
        $ids = $request->ids;
        if (is_array($ids) && !empty($ids)) {
            try {
                $orders = Order::whereIn('id', $ids)
                    ->where('created_by_admin', 1)
                    ->get();
                if ($orders->isEmpty() || $orders->count() != count($ids)) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Không thể xóa. Chỉ các đơn hàng được tạo bởi admin mới có thể bị xóa.',
                        'status' => 'error'
                    ], 400);
                }

                foreach ($orders as $order) {
                    $order->orderDetails()->delete();
                }
                Order::whereIn('id', $orders->pluck('id'))->delete();
                DB::commit();
                return response()->json(['message' => 'Xóa đơn hàng thành công', 'status' => 200], 200);
            } catch (QueryException $e) {
                DB::rollBack();
                if ($e->getCode() == '23000') {
                    return response()->json(['message' => 'Không thể xóa đơn hàng vì có dữ liệu liên quan', 'status' => 'error'], 400);
                }
                return response()->json(['message' => 'Xóa đơn hàng thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
            }
        } else {
            return response()->json(['message' => 'Xóa đơn hàng thất bại', 'status' => 'error'], 400);
        }
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $validateData = $request->validate([
            'status' => 'required|numeric',
        ]);
        try {
            $order = Order::find($id);
            $order->status = $request->status;
            $order->update($validateData);
            return response()->json([
                'message' => 'Cập nhật đơn hàng thành công',
                'status' => 200,
                'order' => $order
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Cập nhật đơn hàng thất bại: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }
    public function updatePaymentStatus(Request $request, $id)
    {
        $validateData = $request->validate([
            'payment_status' => 'required|numeric',
        ]);
        try {
            $order = Order::find($id);
            $order->payment_status = $request->payment_status;
            $order->update($validateData);
            return response()->json([
                'message' => 'Cập nhật đơn hàng thành công',
                'status' => 200,
                'order' => $order
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Cập nhật đơn hàng thất bại: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }
    public function updateShippingStatus(Request $request, $id)
    {
        $validateData = $request->validate([
            'shipping_status' => 'required|numeric',
        ]);
        try {
            $order = Order::find($id);
            $order->shipping_status = $request->shipping_status;
            $order->update($validateData);
            return response()->json([
                'message' => 'Cập nhật đơn hàng thành công',
                'status' => 200,
                'order' => $order
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Cập nhật đơn hàng thất bại: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }
    public function updateOrderDetail(Request $request)
    {
        $validateData = $request->validate([
            'product_variant_id' => 'required|numeric',
            'quantity' => 'required|numeric',
            'order_id' => 'required|numeric',
        ]);

        DB::beginTransaction();
        try {
            $orderId = $request->order_id;
            $productVariantId = $request->product_variant_id;
            $newQuantity = $request->quantity;
            $productVariant = ProductVariant::findOrFail($productVariantId);
            $finalPrice = $productVariant->promotional_price
                ?? $productVariant->price;
            $orderDetail = OrderDetail::where('order_id', $orderId)
                ->where('product_variant_id', $productVariantId)
                ->first();
            if ($orderDetail) {
                // $orderDetail->quantity += 1;
                // $orderDetail->price = $finalPrice;
                // $orderDetail->save();            
                return response()->json([
                    'message' => 'Đơn hàng đã tồn tại',
                    'status' => 'error'
                ]);
            } else {
                $orderDetail = OrderDetail::create([
                    'order_id' => $orderId,
                    'product_variant_id' => $productVariantId,
                    'quantity' => $newQuantity,
                    'price' => $finalPrice,
                ]);
            }
            $totalAmount = OrderDetail::where('order_id', $orderId)
                ->sum(DB::raw('price * quantity'));
            $order = Order::findOrFail($orderId);
            $order->update([
                'total_amount' => $totalAmount,
            ]);
            $updatedOrder = Order::with('orderDetails.productvariant.product')
                ->find($orderId);
            DB::commit();
            return response()->json([
                'message' => 'Cập nhật đơn hàng và chi tiết đơn hàng thành công',
                'status' => 200,
                'order' => $updatedOrder,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Cập nhật đơn hàng thất bại: ' . $e->getMessage(),
                'status' => 'error',
            ], 500);
        }
    }
    public function deleteOrderDetail(Request $request, $id)
    {
        $validateData = $request->validate([
            'order_id' => 'required|numeric',
        ]);
        $order_id = $request->order_id;
        DB::beginTransaction();
        try {
            OrderDetail::where('product_variant_id', $id)->delete();
            $totalAmount = OrderDetail::where('order_id', $order_id)->sum(DB::raw('price * quantity'));
            $order = Order::find($order_id);
            $order->update([
                'total_amount' => $totalAmount,
            ]);
            DB::commit();
            return response()->json([
                'message' => 'Xóa chi tiết đơn hàng thành công',
                'order' => $order,
                'status' => 200,
            ], 200);
        } catch (QueryException $e) {
            DB::rollBack();
            return response()->json(['message' => 'Xóa chi tiết đơn hàng thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
        }
    }

    public function updateQuantities(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'items' => 'required|array',
            'items.*.product_variant_id' => 'required|exists:products_variant,id',
            'items.*.quantity' => 'required|numeric|min:1'
        ]);

        DB::beginTransaction();
        try {
            $orderId = $request->order_id;
            $totalAmount = 0;

            foreach ($validated['items'] as $item) {
                $productVariant = ProductVariant::findOrFail($item['product_variant_id']);
                $finalPrice = $productVariant->promotional_price
                    ?? $productVariant->price;
                $orderDetail = OrderDetail::where('order_id', $orderId)
                    ->where('product_variant_id', $item['product_variant_id'])
                    ->first();

                if ($orderDetail) {
                    $orderDetail->quantity = $item['quantity'];
                    $orderDetail->price = $finalPrice;
                    $orderDetail->save();
                } else {
                    return response()->json([
                        'message' => 'Chi tiết đơn hàng không tồn tại với product_variant_id ' . $item['product_variant_id'],
                        'status' => 'error'
                    ], 404);
                }
            }
            $totalAmount = OrderDetail::where('order_id', $orderId)
                ->sum(DB::raw('price * quantity'));
            $order = Order::findOrFail($orderId);
            $order->update([
                'total_amount' => $totalAmount
            ]);
            $updatedOrder = Order::with('orderDetails.productVariant.product')
                ->find($orderId);
            DB::commit();
            return response()->json([
                'message' => 'Cập nhật số lượng thành công',
                'status' => 200,
                'order' => $updatedOrder
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Cập nhật thất bại: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }
    public function searchByPhone(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|max:255',
        ]);
        $user = User::where('phone', 'LIKE', '%' . $request->phone . '%')
            ->with('shippingAddresses')
            ->limit(5)->get();
        return response()->json($user);
    }

    public function createUser(Request $request)
    {
        $request->validate([
            'fullname' => 'required|string|max:255|regex:/^[^\d]*$/',
            'phone' => 'required|string',
            'provinces' => 'required|string|max:255',
            'districts' => 'required|string|max:255',
            'wards' => 'required|string|max:255',
            'addresses' => 'required|string|max:255',
        ]);
        DB::beginTransaction();
        try {
            $user = User::where('phone', $request->phone)->first();
            if (!$user) {
                $user = User::create([
                    'fullname' => $request->fullname,
                    'phone' => $request->phone,
                    'password' => Hash::make(Str::random(10))
                ]);
            }
            if ($user->shippingAddresses()->count() === 0) {
                $user->shippingAddresses()->create([
                    'fullname' => $request->fullname,
                    'phone' => $request->phone,
                    'provinces' => $request->provinces,
                    'districts' => $request->districts,
                    'wards' => $request->wards,
                    'addresses' => $request->addresses,
                ]);
            }
            $user->assignRole('Users');
            DB::commit();
            return response()->json([
                'user' => $user,
                'status' => 201,
                'message' => 'Thành công',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi tạo người dùng: ' . $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }
}
