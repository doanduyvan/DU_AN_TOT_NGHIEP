<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Product extends Model
{
    use HasFactory, SoftDeletes;
    protected $dates = ['deleted_at'];
    protected $table = 'products';

    protected $fillable = ['product_name', 'description', 'avatar','category_id', 'user_id'];
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id'); 
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }
    public function variants()
    {
        return $this->hasMany(ProductVariant::class, 'product_id');
    }


    public function scopeWithPriceSort($query,$minmax = 'MIN')
    {
        if (!in_array($minmax, ['MIN', 'MAX'])) {
            $minmax = 'MIN';
        }
        return $query->addSelect([
            'price_sort' => ProductVariant::select(DB::raw(
                "$minmax(CASE 
                    WHEN promotional_price IS NOT NULL AND promotional_price > 0 
                    THEN promotional_price 
                    ELSE price 
                END)"
            ))->whereColumn('product_id', 'products.id')
        ]);

    }

    public function scopeWithPriceMin($query)
    {
        return $query->addSelect([
            'price_min' => ProductVariant::select(DB::raw(
                "MIN(CASE 
                    WHEN promotional_price IS NOT NULL AND promotional_price > 0 
                    THEN promotional_price 
                    ELSE price 
                END)"
            ))->whereColumn('product_id', 'products.id')
        ]);

    }

    public function scopeWithSoldQty($query)
    {
        return $query->addSelect([
            'sold_qty' => ProductVariant::select(DB::raw('SUM(sold_quantity)'))
                ->whereColumn('product_id', 'products.id')
        ]);
    }

    public function scopeSortBy($query, $sortBy,$typeSort = 'desc')
    {
        $typeSort = strtolower($typeSort);
        if (!in_array($typeSort, ['asc', 'desc'])) {
            $typeSort = 'desc';
        }

        if($sortBy == 'price_sort'){
            $minmax = $typeSort == 'desc' ? 'MAX' : 'MIN';
            $query->withPriceSort($minmax);
            $query->orderBy('price_sort', $typeSort);
        } else if($sortBy == 'sold_qty'){
            $query->withSoldQty();
            $query->orderBy('sold_qty', $typeSort);
        } else {
            $query->orderBy('created_at', $typeSort);
        }

    }
}


