<?php

namespace App\Http\Controllers\customer;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function checkQtyProductVariant($id){
        $productVariant = ProductVariant::findorFail($id);
        $qty = $productVariant->stock_quantity;
        return response()->json([
            'qty' => $qty
        ]);
    }

    public function getCart(Request $request)
{
    $cart = $request->input('cart');

    if (!is_array($cart) || empty($cart)) {
        return response()->json(['message' => 'Giỏ hàng không hợp lệ'], 400);
    }

    $selectProduct = ['id', 'product_name', 'avatar'];
    $selectVariant = ['id', 'product_id', 'size', 'price', 'promotional_price', 'stock_quantity'];

    $result = [];

    foreach ($cart as $item) {
        $variant = ProductVariant::select($selectVariant)
            ->with(['product' => function ($query) use ($selectProduct) {
                $query->select($selectProduct);
            }])
            ->where('id', $item['variant_id'])
            ->first();

        if ($variant && $variant->product) {
            $result[] = [
                'variant_id'   => $variant->id,
                'product_id'   => $variant->product_id,
                'product_name' => $variant->product->product_name,
                'image'        => $variant->product->avatar,
                'size'         => $variant->size,
                'price'        => $variant->promotional_price ?? $variant->price,
                'price_delete' => $variant->promotional_price ? $variant->price : null,
                'qty'          => $item['qty'],
                'stock'        => $variant->stock_quantity,
            ];
        }
    }

    return response()->json(['data' => $result], 200);
}
    
}
