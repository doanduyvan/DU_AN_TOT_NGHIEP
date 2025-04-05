<?php

namespace App\Http\Controllers\customer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    function getCategoryNews()
    {
        $categories = Category::select('id', 'category_name')->get();
        return response()->json([
            'categories' => $categories
        ]);
    }
}
