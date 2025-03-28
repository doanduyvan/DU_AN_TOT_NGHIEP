<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
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
        $productId = $this->route('id');

        $rules = [
            'category_id' => 'required|exists:category,id',
            'product_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('products')->ignore($productId),
            ],
            'description' => 'nullable|string',
        ];

        $rules['avatar'] = 'nullable|image|max:2048'; 

        if (!$this->has('avatar') && $this->route('id') === null) {
            $rules['avatar'] = 'required|image|max:2048';
        }

        return $rules;
    }
    public function messages()
    {
        return [
            'category_id.required' => 'Danh mục không được để trống',
            'category_id.exists' => 'Danh mục không tồn tại',
            'product_name.required' => 'Tên sản phẩm không được để trống',
            'product_name.string' => 'Tên sản phẩm phải là chuỗi',
            'product_name.max' => 'Tên sản phẩm không được vượt quá 255 ký tự',
            'product_name.unique' => 'Tên sản phẩm đã tồn tại',
            'avatar.required' => 'Ảnh đại diện không được để trống',
            'avatar.image' => 'Ảnh đại diện phải là hình ảnh',
            'avatar.mimes' => 'Hình ảnh phải có định dạng jpeg, png, jpg, gif, webp',
            'avatar.max' => 'Hình ảnh không được vượt quá 2MB',
            'description.string' => 'Mô tả phải là chuỗi',
        ];
    }
}
