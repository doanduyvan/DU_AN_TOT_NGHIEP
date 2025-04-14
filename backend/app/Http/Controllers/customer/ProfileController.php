<?php

namespace App\Http\Controllers\customer;

use App\Http\Controllers\Controller;
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
}
