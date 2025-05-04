<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory, SoftDeletes;
    protected $dates = ['deleted_at'];
    protected $table = 'products';

    protected $fillable = ['product_name', 'description', 'avatar', 'category_id', 'user_id', 'rating_avg', 'total_reviews','status'];
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
        return $this->hasMany(ProductImage::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }
    public function comment()
    {
        return $this->hasMany(CommentProduct::class);
    }

    public function scopePaginate($query, $perPage)
    {
        return $query->paginate($perPage);
    }
    public function scopeApplyFilters($query, $filters)
    {
        $query->when($filters['sortorder'] ?? 'desc', function ($query, $sort) {
            return $query->orderBy('created_at', $sort);
        });
        return $query->paginate($filters['per_page'] ?? 10);
    }
    public function scopeSearch($query, $keyword)
    {
        if (!empty($keyword)) {
            return $query->where('product_name', 'LIKE', '%' . $keyword . '%')
            ->orWhereHas('variants', function ($query) use ($keyword) {
                $query->where('sku', 'LIKE', '%' . $keyword . '%');
            });
        }
        return $query;
    }
    public function scopeFilterCategory($query, $categoryId)
{
    if (!empty($categoryId)) {
        return $query->where('category_id', $categoryId);
    }
    return $query;
}
    public static function restoreByIds(array $ids)
    {
        return static::onlyTrashed()->whereIn('id', $ids)->restore();
    }
    public function scopeOnlyTrashed($query)
    {
        return $query->onlyTrashed();
    }
    public function scopeForceDeleteId($query, $id)
    {
        $product = $query->withTrashed()->where('id', $id)->first();
        if ($product) {
            if ($product->avatar && Storage::disk('public')->exists($product->avatar)) {
                Storage::disk('public')->delete($product->avatar);
            }
            foreach ($product->images as $image) {
                if ($image->img && Storage::disk('public')->exists($image->img)) {
                    Storage::disk('public')->delete($image->img);
                }
            }
            return $product->forceDelete();
        }
    
        return false;
    }

    public function scopeWithPriceSort($query, $minmax = 'MIN')
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

    public function scopeSortBy($query, $sortBy, $typeSort = 'desc')
    {
        $typeSort = strtolower($typeSort);
        if (!in_array($typeSort, ['asc', 'desc'])) {
            $typeSort = 'desc';
        }

        if ($sortBy == 'price_sort') {
            $minmax = $typeSort == 'desc' ? 'MAX' : 'MIN';
            $query->withPriceSort($minmax);
            $query->orderBy('price_sort', $typeSort);
        } else if ($sortBy == 'sold_qty') {
            $query->withSoldQty();
            $query->orderBy('sold_qty', $typeSort);
        } else {
            $query->orderBy('created_at', $typeSort);
        }
    }
}
