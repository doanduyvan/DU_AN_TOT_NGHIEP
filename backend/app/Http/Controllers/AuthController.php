<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Auth\Events\Validated;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;


class AuthController extends Controller
{
    //
    public function register(Request $request)
    {
        $request->validate([
            'fullname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'fullname' => $request->fullname,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // // Gán role mặc định cho user
        $user->assignRole('Users');

        // Tạo token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 200,
            'message' => 'User registered successfully',
            'user' => $user,
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'roles' => $user->getRoleNames(),
            'token' => $token
        ], 200);
    }

    /**
     * Đăng nhập người dùng
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Kiểm tra email
        $user = User::where('email', $request->email)->first();

      
        // Kiểm tra user và password
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email hoặc mật khẩu không đúng.'],
            ]);
        }
        if ($user->status == 0) {
            return response()->json([
                'status' => 401,
                'message' => 'Tài khoản của bạn đã bị khóa'
            ]);
        }
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 200,
            'message' => 'Login successful',
            'user' => $user,
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'roles' => $user->getRoleNames(),
            'token' => $token
        ]);
    }

    /**
     * Lấy thông tin người dùng hiện tại
     */
    public function me(Request $request)
    {
        if($request->user()->status == 0){
            return response()->json([
                'status' => 401,
                'message' => 'Tài khoản của bạn đã bị khóa'
            ]);
        }
        return response()->json([
            'status' => true,
            'user' => $request->user(),
            'permissions' => $request->user()->getAllPermissions()->pluck('name'),
            'roles' => $request->user()->getRoleNames(),
        ]);
    }

    /**
     * Đăng xuất người dùng
     */
    public function logout(Request $request)
    {
        // Xóa token hiện tại
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => true,
            'message' => 'Successfully logged out'
        ]);
    }

    /**
     * Đăng xuất khỏi tất cả các thiết bị
     */
    public function logoutAll(Request $request)
    {
        // Xóa tất cả token
        $request->user()->tokens()->delete();

        return response()->json([
            'status' => true,
            'message' => 'Successfully logged out from all devices'
        ]);
    }
}
