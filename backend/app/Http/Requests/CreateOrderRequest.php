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
            'shipping_fee' => 'required|numeric|min:0', // Kiểm tra phí vận chuyển có giá trị dương
            'fullname' => 'required|string|min:3|max:255|regex:/^[^\d]*$/',
            'phone' => ['required', 'string', 'size:10', 'regex:/^0[3-9]{1}[0-9]{8}$/'], // Kiểm tra số điện thoại đúng định dạng (10 ký tự, bắt đầu bằng 0 và theo đúng mẫu số điện thoại ở VN)
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

    public function messages()
    {
        return [
            'fullname.required' => 'Họ tên là bắt buộc.',
            'fullname.string' => 'Họ tên phải là một chuỗi ký tự.',
            'fullname.min' => 'Họ tên phải có ít nhất 3 ký tự.',
            'fullname.max' => 'Họ tên không được vượt quá 255 ký tự.',
            'fullname.regex' => 'Họ và tên không được chứa số.',
            'payment_status.required' => 'Trạng thái thanh toán là bắt buộc.',
            'payment_status.numeric' => 'Trạng thái thanh toán phải là một số.',
            'shipping_status.required' => 'Trạng thái vận chuyển là bắt buộc.',
            'shipping_status.numeric' => 'Trạng thái vận chuyển phải là một số.',
            'status.required' => 'Trạng thái đơn hàng là bắt buộc.',
            'status.numeric' => 'Trạng thái đơn hàng phải là một số.',
            'shipping_fee.required' => 'Phí vận chuyển là bắt buộc.',
            'shipping_fee.numeric' => 'Phí vận chuyển phải là một số.',
            'shipping_fee.min' => 'Phí vận chuyển phải lớn hơn hoặc bằng 0.',
            'phone.required' => 'Số điện thoại là bắt buộc.',
            'phone.string' => 'Số điện thoại phải là một chuỗi ký tự.',
            'phone.size' => 'Số điện thoại phải có đúng 10 ký tự.',
            'phone.regex' => 'Số điện thoại không đúng định dạng. Vui lòng nhập lại.',
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
