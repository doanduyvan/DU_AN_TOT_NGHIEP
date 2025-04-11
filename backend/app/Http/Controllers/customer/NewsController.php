<?php

namespace App\Http\Controllers\customer;

use App\Http\Controllers\Controller;
use App\Models\CategoryNews;
use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    function getCategoryNews()
    {
        $categories = CategoryNews::select('id', 'category_news_name')->get();
        return response()->json([
            'categories' => $categories
        ]);
    }

    function getNews(Request $request){

        $per_page = 12;

        $newsSelect = ['id', 'title', 'avatar', 'created_at'];

        $query = News::query();
        $query->select($newsSelect)
            ->whereNull('deleted_at');
        $categoryName = 'Tất cả';
    
        if ($request->has('category_news_id')) {
            $query->where('category_news_id', $request->category_news_id);
            $category = CategoryNews::find($request->category_news_id);
            if ($category) {
                $categoryName = $category->category_news_name;
            }
        }

        if($request->has('per_page')){
            $per_page = $request->per_page;
        }
    
        $news = $query->orderByDesc('created_at')->paginate($per_page);
    
        return response()->json([
            'category_name' => $categoryName,
            'data' => $news->items(),
            'current_page' => $news->currentPage(),
            'last_page' => $news->lastPage(),
            'total' => $news->total(),
            'per_page' => $news->perPage(),
        ]);
    }
}
