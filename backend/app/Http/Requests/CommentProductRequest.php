<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CommentProductRequest extends FormRequest
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
            'product_id' => 'required|exists:products,id',
            'user_id' => 'required|exists:users,id',
            'content' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment_product_id' => 'nullable|exists:comment_products,id',
        ];
    }

    public function messages()
    {
        return [
            'product_id.required' => 'Vui lòng chọn sản phẩm',
            'product_id.exists' => 'Sản phẩm không tồn tại',
            'user_id.required' => 'Vui lòng chọn người dùng',
            'user_id.exists' => 'Người dùng không tồn tại',
            'content.required' => 'Vui lòng nhập nội dung bình luận',
            'content.string' => 'Nội dung bình luận phải là chuỗi',
            'content.max' => 'Nội dung bình luận không được vượt quá 255 ký tự',
            'rating.required' => 'Vui lòng chọn đánh giá',
            'rating.integer' => 'Đánh giá phải là số nguyên',
            'rating.min' => 'Đánh giá phải lớn hơn hoặc bằng 1',
            'rating.max' => 'Đánh giá phải nhỏ hơn hoặc bằng 5',
        ];
    }
    // protected function prepareForValidation()
    // {
    //     $this->merge([
    //         'user_id' => auth()->user()->id,
    //     ]);
    // }
}
