<?php

namespace App\Http\Controllers\customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductdetailController extends Controller
{
    function getProductById($id)
    {
        $product = Product::with(['variants','images'])
        ->where('id', $id)
        ->whereNull('deleted_at')
        ->where('status', 1)
        ->first();

        return response()->json([
            'product' => $product
        ]);
    }

    function getRelatedProducts($id){


        $product = Product::findOrFail($id);

        $productSelect = ['id', 'avatar', 'product_name', 'rating_avg','total_reviews'];

        $related = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $id) 
            ->where('status', 1)
            ->whereNull('deleted_at')
            ->with(['variants' => function ($query) {
                $variantSelect = ['id', 'product_id', 'size', 'price', 'promotional_price','sold_quantity'];
                $query->select($variantSelect);
            }])
            ->select($productSelect)
            ->limit(10)
            ->get();
    
        return response()->json([
            'related' => $related
        ]);
    }
}
