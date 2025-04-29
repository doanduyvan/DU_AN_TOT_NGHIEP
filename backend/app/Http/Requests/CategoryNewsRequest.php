<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryNewsRequest extends FormRequest
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
            'category_news_name' => 'required|string|max:255|unique:category_news,category_news_name,' . $id,
            'img' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ];
    }
    public function messages(): array
    {
        return [
            'category_news_name.required' => 'Tên danh mục không được để trống',
            'category_news_name.string' => 'Tên danh mục phải là chuỗi',
            'category_news_name.max' => 'Tên danh mục không được vượt quá 255 ký tự',
            'category_news_name.unique' => 'Tên danh mục đã tồn tại',
            'img.image' => 'Hình ảnh phải là hình ảnh',
            'img.mimes' => 'Hình ảnh phải có định dạng jpeg, png, jpg, gif, webp',
            'img.max' => 'Hình ảnh không được vượt quá 2MB',
        ];
    }
}
