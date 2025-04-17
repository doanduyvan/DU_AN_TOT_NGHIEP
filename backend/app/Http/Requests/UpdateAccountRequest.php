<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAccountRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $id = $this->route('id'); // Lấy ID từ route parameter

        return [
            'fullname' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $id,
            'phone' => 'required|string|size:10', 
            'status' => 'required|numeric',
        ];
    }

    /**
     * Tùy chỉnh thông báo lỗi xác thực.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'fullname.required' => 'Họ và tên là bắt buộc.',
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã được sử dụng.',
            'phone.required' => 'Số điện thoại là bắt buộc.',
            'phone.numeric' => 'Số điện thoại phải là dạng số.',
            'phone.size' => 'Số điện thoại phải có đúng 10 ký tự.',
            'status.required' => 'Trạng thái là bắt buộc.',
            'status.numeric' => 'Trạng thái phải là một số.',
        ];
    }
}
