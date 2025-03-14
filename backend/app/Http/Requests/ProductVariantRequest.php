<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductVariantRequest extends FormRequest
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
            'size' => 'required|string',
            'price' => 'required|numeric',
            'promotional_price' => 'numeric',
            'stock_quantity' => 'required|integer',
        ];
    }
    public function messages()
    {
        return [
            'size.required' => 'Kích thước không được để trống',
            'size.string' => 'Kích thước phải là chuỗi',
            'price.required' => 'Giá không được để trống',
            'price.numeric' => 'Giá phải là số',
            'promotional_price.numeric' => 'Giảm giá phải là số',
            'tock_quantity.required' => 'Số lượng không được để trống',
            'stock_quantity.integer' => 'Số lượng phải là số nguyên',
        ];
    }
}
