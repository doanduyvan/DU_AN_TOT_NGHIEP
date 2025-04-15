<?php

namespace App\Http\Controllers\customer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\News;
use App\Models\Product;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function test()
    {
        return response()->json([
            'message' => 'Hello from the test method!'
        ]);
    }

    public function getNewProducts()
    {
        $newProducts = Product::select('id', 'avatar', 'product_name', 'rating_avg')
            ->where('status', 1)
            ->with(['variants' => function ($query) {
                $query->select('id','product_id', 'price', 'promotional_price', 'sold_quantity');
            }])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        foreach ($newProducts as $product) {
            $product->total_sold = $product->variants->sum('sold_quantity');
            $product->cheapest_variant = $product->variants->sortBy('price')->first();
            unset($product->variants);
        }

        return response()->json([
            'newProducts' => $newProducts
        ], 200);
    }

    public function getCategory(){
        $categories = Category::select('id', 'category_name', 'img')
            ->get();

        return response()->json([
            'categories' => $categories
        ], 200);
    }

    public function get3News(){
        $news = News::select('id', 'title', 'avatar')
            ->whereNull('deleted_at')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        return response()->json([
            'news' => $news
        ], 200);
    }
}
