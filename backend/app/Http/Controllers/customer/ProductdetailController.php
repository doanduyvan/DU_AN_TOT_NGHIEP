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
}
