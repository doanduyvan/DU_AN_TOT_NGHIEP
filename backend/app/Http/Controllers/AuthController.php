<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Auth\Events\Validated;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\RegisterUserRequest;
use App\Mail\ResetPasswordMail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerifyEmail;
use App\Models\EmailVerification;

class AuthController extends Controller
{
    //
    public function register(RegisterUserRequest $request)
    {
        DB::beginTransaction();
        try {
            $user = User::create([
                'fullname' => $request->fullname,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
            $user->assignRole('Users');

            $token = Str::random(64);
            EmailVerification::updateOrCreate(
                ['email' => $user->email],
                ['token' => $token, 'created_at' => now()]
            );
            Mail::to($user->email)->send(new VerifyEmail($token));
            DB::commit();

            return response()->json([
                'status' => 200,
                'message' => 'Đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản.',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'Có một số lỗi trong quá trình đăng kí, vui lòng thử lại sau.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    

    /**
     * Đăng nhập người dùng
     */
    public function login(Request $request)
    {

        $messages = [
            'email.required' => 'Email không được để trống.',
            'email.email' => 'Vui lòng nhập đúng định dạng email.',
            'password.required' => 'Mật khẩu không được để trống.',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.',
            'password.max' => 'Mật khẩu không được vượt quá 255 ký tự.',
        ];

        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string|min:6|max:255',
        ], $messages);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            if ($user->is_verify == 0) {
                return response()->json([
                    'is_verify' => 0,
                    'status' => 403,
                    'email' => $user->email,
                    'message' => 'Tài khoản của bạn chưa được xác nhận.'
                ],403);
            }
        }


        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 401,
                'message' => 'Thông tin đăng nhập không chính xác.'
            ],403);
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

    public function resendVerifyEmail(Request $request)
    {
        $email = $request->input('email');
        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'Email không tồn tại trong hệ thống.'
            ]);
        }
        if ($user->is_verify == 1) {
            return response()->json([
                'status' => 200,
                'message' => 'Tài khoản của bạn đã được xác nhận.'
            ]);
        }

        $token = Str::random(64);
        EmailVerification::updateOrCreate(
            ['email' => $user->email],
            ['token' => $token, 'created_at' => now()]
        );
        Mail::to($user->email)->send(new VerifyEmail($token));

        return response()->json([
            'status' => 200,
            'message' => 'Đã gửi lại email xác nhận. Vui lòng kiểm tra email của bạn.'
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

    public function verifyEmail(Request $request)
    {

        $token = $request->query('token');
        if (!$token) {
            return response()->json(['message' => 'Thiếu token xác nhận.'], 400);
        }

        $verification = EmailVerification::where('token', $token)->first();
        if (!$verification) {
            return response()->json(['message' => 'Token không hợp lệ hoặc đã được sử dụng.'], 400);
        }

        $user = User::where('email', $verification->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy tài khoản tương ứng.'], 404);
        }

        $user->is_verify = 1;
        $user->save();

        $verification->delete(); // Xóa token sau khi dùng

        return response()->json(['message' => 'Xác nhận email thành công.'], 200);
    }

    public function sendResetPasswordEmail(Request $request){

        $messages = [
            'email.required' => 'Email không được để trống.',
            'email.email' => 'Vui lòng nhập đúng định dạng email.',
            'email.exists' => 'Email không tồn tại, hoặc chưa được kích hoạt.',
        ];

        $request->validate([
            'email' => 'required|email|exists:users,email,is_verify,1'
        ], $messages);

        $token = Str::random(64);

        DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            ['token' => $token, 'created_at' => now()]
        );
        Mail::to($request->email)->send(new ResetPasswordMail($token));
        return response()->json(['message' => 'Đã gửi email đặt lại mật khẩu.']);
    }

    public function checkResetToken(Request $request)
    {
        $token = $request->query('token');

        if (!$token) {
            return response()->json([
                'valid' => false,
                'message' => 'Thiếu token xác nhận.'
            ], 400);
        }

        $row = DB::table('password_resets')->where('token', $token)->first();

        if (!$row) {
            return response()->json(['valid' => false], 404);
        }

        return response()->json(['valid' => true]);
    }

    public function resetPassword(Request $request)
    {

        $message = [
            'token.required' => 'Token không được để trống.',
            'password.required' => 'Mật khẩu không được để trống.',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp.',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.',
            'password.max' => 'Mật khẩu không được vượt quá 255 ký tự.',
        ];

        $request->validate([
            'token' => 'required|string',
            'password' => 'required|confirmed|min:6|max:255',
        ], $message);
    
        $row = DB::table('password_resets')->where('token', $request->token)->first();
    
        if (!$row) {
            return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 400);
        }
    
        $user = User::where('email', $row->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng.'], 404);
        }
    
        // cập nhật mật khẩu mới
        $user->password = Hash::make($request->password);
        $user->save();
    
        // xoá token reset sau khi dùng
        DB::table('password_resets')->where('email', $row->email)->delete();
    
        return response()->json(['message' => 'Đặt lại mật khẩu thành công.']);
    }
}
