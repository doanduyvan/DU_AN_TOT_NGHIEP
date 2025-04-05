<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CommentNewsRequest extends FormRequest
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
            'news_id' => 'required|exists:news,id',
            'user_id' => 'required|exists:users,id',
            'content' => 'required|string|max:255',
            'comment_news_id' => 'nullable|exists:comment_news,id',
        ];
    }

    public function messages()
    {
        return [
            'news_id.required' => 'Vui lòng chọn tin',
            'news_id.exists' => 'Tin không tồn tại',
            'user_id.required' => 'Vui lòng chọn người dùng',
            'user_id.exists' => 'Người dùng không tồn tại',
            'content.required' => 'Vui lòng nhập nội dung bình luận',
            'content.string' => 'Nội dung bình luận phải là chuỗi',
            'content.max' => 'Nội dung bình luận không được vượt quá 255 ký tự',
        ];
    }
    // protected function prepareForValidation()
    // {
    //     $this->merge([
    //         'user_id' => auth()->user()->id,
    //     ]);
    // }
}

