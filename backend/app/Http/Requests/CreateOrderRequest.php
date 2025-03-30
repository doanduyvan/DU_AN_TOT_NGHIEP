<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
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
        return [
            'payment_status' => 'required|numeric',
            'shipping_status' => 'required|numeric',
            'status' => 'required|numeric',
            'shipping_fee' => 'required|numeric',
            'fullname' => 'required|string|min:3|max:255', 
            'phone' => 'required|string|size:10', 
            'shipping_address' => 'required|string|max:255',
            'payment_method' => 'required|string|max:50',
            'carrier' => 'nullable|string|max:50',
            'tracking_number' => 'nullable|string|max:50',
            'order_details' => 'required|array',
            'order_details.*.product_variant_id' => 'required|numeric|exists:products_variant,id',
            'order_details.*.quantity' => 'required|numeric|min:1',
            'order_details.*.price' => 'required|numeric|min:0',
        ];
    }

    /**
     * Get the custom messages for the validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'payment_status.required' => 'Trạng thái thanh toán là bắt buộc.',
            'payment_status.numeric' => 'Trạng thái thanh toán phải là một số.',
            'shipping_status.required' => 'Trạng thái vận chuyển là bắt buộc.',
            'shipping_status.numeric' => 'Trạng thái vận chuyển phải là một số.',
            'status.required' => 'Trạng thái đơn hàng là bắt buộc.',
            'status.numeric' => 'Trạng thái đơn hàng phải là một số.',
            'shipping_fee.required' => 'Phí vận chuyển là bắt buộc.',
            'shipping_fee.numeric' => 'Phí vận chuyển phải là một số.',
            'fullname.required' => 'Tên đầy đủ là bắt buộc.',
            'fullname.string' => 'Tên đầy đủ phải là một chuỗi ký tự.',
            'fullname.min' => 'Tên đầy đủ phải có ít nhất 3 ký tự.',
            'fullname.max' => 'Tên đầy đủ không được vượt quá 255 ký tự.',
            'phone.required' => 'Số điện thoại là bắt buộc.',
            'phone.string' => 'Số điện thoại phải là một chuỗi ký tự.',
            'phone.size' => 'Số điện thoại phải có đúng 10 ký tự.',
            'shipping_address.required' => 'Địa chỉ giao hàng là bắt buộc.',
            'shipping_address.string' => 'Địa chỉ giao hàng phải là một chuỗi ký tự.',
            'shipping_address.max' => 'Địa chỉ giao hàng không được vượt quá 255 ký tự.',
            'payment_method.required' => 'Phương thức thanh toán là bắt buộc.',
            'payment_method.string' => 'Phương thức thanh toán phải là một chuỗi ký tự.',
            'payment_method.max' => 'Phương thức thanh toán không được vượt quá 50 ký tự.',
            'carrier.string' => 'Nhà vận chuyển phải là một chuỗi ký tự.',
            'carrier.max' => 'Nhà vận chuyển không được vượt quá 50 ký tự.',
            'tracking_number.string' => 'Mã vận đơn phải là một chuỗi ký tự.',
            'tracking_number.max' => 'Mã vận đơn không được vượt quá 50 ký tự.',
            'order_details.required' => 'Chi tiết đơn hàng là bắt buộc.',
            'order_details.array' => 'Chi tiết đơn hàng phải là một mảng.',
            'order_details.*.product_variant_id.required' => 'Mã sản phẩm là bắt buộc.',
            'order_details.*.product_variant_id.numeric' => 'Mã sản phẩm phải là một số.',
            'order_details.*.product_variant_id.exists' => 'Mã sản phẩm không tồn tại.',
            'order_details.*.quantity.required' => 'Số lượng sản phẩm là bắt buộc.',
            'order_details.*.quantity.numeric' => 'Số lượng sản phẩm phải là một số.',
            'order_details.*.quantity.min' => 'Số lượng sản phẩm phải lớn hơn hoặc bằng 1.',
            'order_details.*.price.required' => 'Giá sản phẩm là bắt buộc.',
            'order_details.*.price.numeric' => 'Giá sản phẩm phải là một số.',
            'order_details.*.price.min' => 'Giá sản phẩm phải lớn hơn hoặc bằng 0.',
        ];
    }
}
