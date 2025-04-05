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
            'variants.*.size' => 'required|string',
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.promotional_price' => 'nullable|numeric|min:0',
            'variants.*.sku' => 'nullable|string',
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
            'variants.*.sku.unique' => 'Mã sản phẩm đã tồn tại.',
            'variants.*.stock_quantity.required' => 'Số lượng tồn kho của biến thể là bắt buộc.',
            'variants.*.stock_quantity.integer' => 'Số lượng tồn kho phải là số nguyên.',
            'variants.*.stock_quantity.min' => 'Số lượng tồn kho phải lớn hơn hoặc bằng 0.',
        ];
    }
}
