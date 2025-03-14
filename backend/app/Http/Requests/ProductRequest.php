<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
        $rules = [
            'category_id' => 'required|exists:category,id',
            'product_name' => 'required|string|max:255',
            'description' => 'string',
        ];
        if (!$this->route('id')) {
            $rules['avatar'] = 'required|image|max:2048';
        } else {
            $rules['avatar'] = 'nullable|image|max:2048';
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
            'avatar.required' => 'Ảnh đại diện không được để trống',
            'avatar.image' => 'Ảnh đại diện phải là hình ảnh',
            'avatar.mimes' => 'Hình ảnh phải có định dạng jpeg, png, jpg, gif, webp',
            'avatar.max' => 'Hình ảnh không được vượt quá 2MB',
            'description.string' => 'Mô tả phải là chuỗi',
        ];
    }
}
