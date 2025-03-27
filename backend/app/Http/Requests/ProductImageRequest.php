<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductImageRequest extends FormRequest
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
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ];

        if (!$this->route('id')) { 
            $rules['images'] = 'required|array'; 
            $rules['images.*'] = 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048';  
        } else {
            $rules['images'] = 'nullable|array';
            $rules['images.*'] = 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048';
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'images.required' => 'Hình ảnh sản phẩm không được để trống',
            'images.array' => 'Hình ảnh phải là một mảng',
            'images.*.required' => 'Hình ảnh sản phẩm không được để trống',
            'images.*.image' => 'Hình ảnh không đúng định dạng',
            'images.*.mimes' => 'Hình ảnh phải có định dạng jpeg, png, jpg, gif, svg 1',
        ];
    }
}
