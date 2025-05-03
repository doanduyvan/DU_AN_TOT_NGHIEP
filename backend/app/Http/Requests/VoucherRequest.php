<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VoucherRequest extends FormRequest
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
        $id = $this->route('id');
        return [
            'code' => 'required|string|unique:voucher,code,' . $id . '|min:6|max:255|regex:/^[a-zA-Z0-9]+$/',
            'title' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'quantity_used' => 'integer|min:0',
            'status' => 'in:active,inactive', 
            'expiry_date' => 'required|date|after:today',
            'discount_type' => 'required',
            'user_id' => 'nullable|exists:users,id',
            'discount_value' => 'required|numeric|min:0' . ($this->discount_type == '1' ? '|max:100' : ''),
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'code.required' => 'Mã voucher là bắt buộc.',
            'code.unique' => 'Mã voucher này đã tồn tại.',
            'code.min' => 'Mã voucher phải lớn hơn 6 ký tự.',
            'code.regex' => 'Mã voucher chỉ được chứa chữ cái và số, không được chứa ký tự đặc biệt.',
            'title.required' => 'Tiêu đề voucher là bắt buộc.',
            'quantity.required' => 'Số lượng voucher là bắt buộc.',
            'quantity.integer' => 'Số lượng voucher phải là số nguyên.',
            'quantity.min' => 'Số lượng voucher phải lớn hơn hoặc bằng 1.',
            'status.required' => 'Trạng thái voucher là bắt buộc.',
            'status.in' => 'Trạng thái voucher không hợp lệ.',
            'expiry_date.required' => 'Ngày hết hạn là bắt buộc.',
            'expiry_date.date' => 'Ngày hết hạn phải là một ngày hợp lệ.',
            'expiry_date.after' => 'Ngày hết hạn phải sau ngày hôm nay.',
            'discount_value.required' => 'Giá trị giảm giá là bắt buộc.',
            'discount_value.numeric' => 'Giá trị giảm giá phải là số.',
            'discount_value.min' => 'Giá trị giảm giá phải là số dương.',
            'discount_value.max' => 'Giá trị giảm giá phần trăm không được vượt quá 100.',
            'discount_type.required' => 'Loại giảm giá là bắt buộc.',
            'user_id.exists' => 'Người dùng không tồn tại.',
        ];
    }

    /**
     * Get the custom attributes for validator errors.
     *
     * @return array
     */
    public function attributes()
    {
        return [
            'code' => 'Mã voucher',
            'title' => 'Tiêu đề voucher',
            'quantity' => 'Số lượng voucher',
            'quantity_used' => 'Số lượng voucher đã sử dụng',
            'status' => 'Trạng thái voucher',
            'expiry_date' => 'Ngày hết hạn',
            'discount_value' => 'Giá trị giảm giá',
            'discount_type' => 'Loại giảm giá',
            'user_id' => 'Người dùng',
        ];
    }
}
