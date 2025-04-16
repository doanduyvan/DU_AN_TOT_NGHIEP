<?php

namespace App\Http\Controllers\customer;

use App\Http\Controllers\Controller;
use App\Models\ShippingAddress;
use Illuminate\Http\Request;
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

    $user = $request->user();

    ShippingAddress::create([
        'fullname' => $request->fullname,
        'phone' => $request->phone,
        'provinces' => $request->provinces,
        'districts' => $request->districts,
        'wards' => $request->wards,
        'addresses' => $request->addresses,
        'user_id' => $user->id,
    ]);

    return response()->json([
        'status' => true,
        'message' => 'Thêm địa chỉ thành công',
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
}
