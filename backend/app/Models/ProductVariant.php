<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory;
    protected $table = 'products_variant';
    protected $fillable = ['product_id', 'size', 'price', 'stock_quantity', 'sku', 'promotional_price'];
    public function product (){
        return $this->belongsTo(Product::class, 'product_id');
    }
}
