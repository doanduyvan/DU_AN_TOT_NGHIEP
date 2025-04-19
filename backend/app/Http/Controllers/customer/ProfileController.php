<?php

namespace App\Http\Controllers\customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\ShippingAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    public function updateAvatar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048', // 2MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Xóa ảnh cũ nếu có
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Lưu ảnh mới
        $path = $request->file('avatar')->store('avatars', 'public');

        $user->avatar = $path;
        $user->save();

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật ảnh thành công',
            'avatar' => $path
        ]);
    }

    public function updateInfo(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fullname' => 'required|string|max:255',
            'phone' => [
                'required',
                'regex:/^(0|\+84)[3-9][0-9]{8}$/',
                'max:15'
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user(); // user hiện tại qua sanctum

        $user->fullname = $request->fullname;
        $user->phone = $request->phone;
        $user->save();

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật thông tin thành công',
        ]);
    }

    public function addAddress(Request $request)
    {

        $maxAddress = 10; // Giới hạn số lượng địa chỉ

        $user = $request->user();

        $addressCount = ShippingAddress::where('user_id', $user->id)->count();
        if ($addressCount >= $maxAddress) {
            return response()->json([
                'message' => "Bạn chỉ có thể thêm tối đa $maxAddress địa chỉ giao hàng.",
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'provinces' => 'required|string|max:255',
            'districts' => 'required|string|max:255',
            'wards' => 'required|string|max:255',
            'addresses' => 'required|string|max:255',
            'fullname' => 'required|string|max:255',
            'phone' => 'required|string|regex:/^0\d{9}$/',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }



        $new = ShippingAddress::create([
            'fullname' => $request->fullname,
            'phone' => $request->phone,
            'provinces' => $request->provinces,
            'districts' => $request->districts,
            'wards' => $request->wards,
            'addresses' => $request->addresses,
            'user_id' => $user->id,
        ]);

        $new->is_default = false; // Đặt mặc định là false

        return response()->json([
            'status' => true,
            'message' => 'Thêm địa chỉ thành công',
            'address' => $new,
        ]);
    }

    public function getAddress(Request $request)
    {
        $user = $request->user();
        $addresses = ShippingAddress::where('user_id', $user->id)
            ->get();

        return response()->json([
            'status' => true,
            'addresses' => $addresses,
        ]);
    }

    public function deleteAddress(Request $request, $id)
    {
        $user = $request->user();
        $address = ShippingAddress::where('user_id', $user->id)->where('id', $id)->first();
        if (!$address) {
            return response()->json([
                'status' => false,
                'message' => 'Địa chỉ không tồn tại',
            ], 404);
        }
        $address->delete();
        return response()->json([
            'status' => true,
            'message' => 'Xóa địa chỉ thành công',
        ]);
    }

    public function setDefaultAddress(Request $request, $id)
    {
        $user = $request->user();
        $address = ShippingAddress::where('user_id', $user->id)->where('id', $id)->first();
        if (!$address) {
            return response()->json([
                'message' => 'Địa chỉ không tồn tại',
            ], 404);
        }
        ShippingAddress::where('user_id', $user->id)
            ->where('is_default', true)
            ->update(['is_default' => false]);
        $address->is_default = true;
        $address->save();
        return response()->json([
            'message' => 'Đặt địa chỉ mặc định thành công',
        ]);
    }

    public function getOrders(Request $request)
    {
        $user = $request->user();
        $status = $request->input('status', 1);
        $perPage = $request->input('per_page', 10);

        $selectOrder = ['id','order_date','total_amount','status','payment_method','shipping_address','user_id','fullname','phone','carrier','tracking_number','shipping_fee','payment_status','shipping_status','created_at','note',];
        $selectOrderDetail = ['id','price','quantity','order_id','product_variant_id'];
        $selectProductVariant = ['id', 'size','product_id'];
        $selectProduct = ['id', 'product_name', 'avatar'];
        
        $orders = Order::select($selectOrder)
        ->with([
            'orderDetails' => function ($q) use ($selectOrderDetail) {
                $q->select($selectOrderDetail);
            },
            'orderDetails.productvariant' => function ($q) use ($selectProductVariant) {
                $q->select($selectProductVariant);
            },
            'orderDetails.productvariant.product' => function ($q) use ($selectProduct) {
                $q->select($selectProduct);
            }
        ])
        ->where('user_id', $user->id)
        ->where('status', $status)
        ->latest()
        ->paginate($perPage);
    
        return response()->json([
            'status' => true,
            'orders' => $orders,
        ]);
    }

    public function CancelOrder(Request $request, $id)
    {
        $user = $request->user();
        $inStatus = [1, 2, 3]; // Trạng thái có thể huỷ
    
        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->first();
    
        if (!$order) {
            return response()->json(['message' => 'Đơn hàng không tồn tại.'], 404);
        }
    
        if (!in_array($order->status, $inStatus)) {
            return response()->json(['message' => 'Đơn hàng không thể huỷ ở trạng thái hiện tại.'], 400);
        }
    
        DB::beginTransaction();
    
        try {
            // Cộng lại số lượng hàng trong kho
            foreach ($order->orderDetails as $detail) {
                $variant = ProductVariant::find($detail->product_variant_id);
                if ($variant) {
                    $variant->stock_quantity += $detail->quantity;
                    $variant->sold_quantity = max(0, $variant->sold_quantity - $detail->quantity);
                    $variant->save();
                }
            }

            $order->status = 7; // Đã hủy
            $order->save();
    
            DB::commit();
            return response()->json(['message' => 'Huỷ đơn hàng thành công.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Đã xảy ra lỗi khi huỷ đơn hàng.'], 500);
        }
    }
}
