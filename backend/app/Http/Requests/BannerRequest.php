<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BannerRequest extends FormRequest
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
            'link' => 'nullable|url', 
            'img' => 'nullable|image|max:2048',
        ];
    }
    
    public function messages()
    {
        return [
            'link.required' => 'Link không được để trống',
            'link.url' => 'Link không đúng định dạng URL', 
            'img.image' => 'Hình ảnh không đúng định dạng',
            'img.mimes' => 'Hình ảnh phải có định dạng jpeg, png, jpg, gif, svg',
        ];
    }
    
}
