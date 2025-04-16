<?php

namespace App\Http\Controllers\customer;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;

class NewsdetailController extends Controller
{
    function getNewsById($id){
        $news = News::find($id);
        if ($news) {
            return response()->json([
                'message' => 'News found',
                'data' => $news
            ],200);
        } else {
            return response()->json([
                'message' => 'News not found'
            ], 404);
        }
    }

    function getNewsRelated($id){
        $news = News::findOrFail($id);
        $select = ['id', 'title', 'avatar', 'created_at'];
        // Lấy bài viết cùng danh mục
        $related = News::where('category_news_id', $news->category_news_id)
            ->where('id', '!=', $id)
            ->whereNull('deleted_at')
            ->select($select)
            ->limit(10)
            ->get();
        return response()->json([
            'related' => $related
        ]);
    }
}
