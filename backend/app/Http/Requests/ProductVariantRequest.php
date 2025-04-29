<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductVariantRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'variants' => 'required|array|min:1',
            'variants.*.size' => 'required|string|regex:/^[a-zA-Z0-9]+$/',
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.promotional_price' => 'nullable|numeric|min:0|lt:variants.*.price',
            'variants.*.sku' => 'nullable|string|regex:/^[a-zA-Z0-9]+$/',
            'variants.*.stock_quantity' => 'required|integer|min:0',
        ];
    }

    public function messages()
    {
        return [
            'variants.required' => 'Biến thể sản phẩm là bắt buộc.',
            'variants.array' => 'Biến thể sản phẩm phải là một mảng.',
            'variants.*.price.required' => 'Giá của biến thể là bắt buộc.',
            'variants.*.price.numeric' => 'Giá của biến thể phải là một số.',
            'variants.*.price.min' => 'Giá của biến thể phải lớn hơn hoặc bằng 0.',
            'variants.*.promotional_price.numeric' => 'Giá khuyến mãi phải là một số.',
            'variants.*.promotional_price.min' => 'Giá khuyến mãi phải lớn hơn hoặc bằng 0.',
            'variants.*.promotional_price.lt' => 'Giá khuyến mãi không thể lớn hơn giá sản phẩm.',
            'variants.*.sku.regex' => 'Mã sản phẩm chỉ được chứa chữ cái và số, không được có dấu hoặc ký tự đặc biệt.',
            'variants.*.size.regex' => 'Size sản phẩm chỉ được chứa chữ cái và số, không được có dấu hoặc ký tự đặc biệt.',
            'variants.*.stock_quantity.required' => 'Số lượng tồn kho của biến thể là bắt buộc.',
            'variants.*.stock_quantity.integer' => 'Số lượng tồn kho phải là số nguyên.',
            'variants.*.stock_quantity.min' => 'Số lượng tồn kho phải lớn hơn hoặc bằng 0.',
        ];
    }
}
