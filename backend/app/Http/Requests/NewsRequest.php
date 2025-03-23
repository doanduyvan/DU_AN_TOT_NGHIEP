<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NewsRequest extends FormRequest
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
            'category_news_id' => 'required|exists:category_news,id',
            'title' => 'required|string|max:255',
            'content' => 'string',
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ];
        return $rules;
    }
    public function messages()
    {
        return [
            'category_news_id.required' => 'Danh mục không được để trống',
            'category_news_id.exists' => 'Danh mục không tồn tại',
            'title.required' => 'Tiêu đề không được để trống',
            'title.string' => 'Tiêu đề phải là chuỗi',
            'title.max' => 'Tiêu đề không được vượt quá 255 ký tự',
            'avatar.required' => 'Hình ảnh không được để trống',
            'avatar.image' => 'Hình ảnh phải là hình ảnh',
            'avatar.mimes' => 'Hình ảnh phải có định dạng jpeg, png, jpg, gif, webp',
            'avatar.max' => 'Hình ảnh không được vượt quá 2MB',
            'content.string' => 'Mô tả phải là chuỗi',
        ];
    }
}
