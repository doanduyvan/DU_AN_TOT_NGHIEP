<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Category extends Model
{
    use SoftDeletes;
    use HasFactory;
    protected $table = 'category';
    protected $fillable = ['category_name', 'img'];
    protected $dates = ['deleted_at'];

    public function products()
    {
        return $this->hasMany(Product::class, 'category_id', 'id');
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
            return $query->where('category_name', 'LIKE', '%' . $keyword . '%');
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
    public function scopeWithTrashed($query)
    {
        return $query->withTrashed();
    }
    public function scopeForceDeleteId($query, $id)
    {
        $category = $query->withTrashed()->where('id', $id)->first();
        if ($category) {
            if ($category->img && Storage::disk('public')->exists($category->img)) {
                Storage::disk('public')->delete($category->img);
            }
            return $category->forceDelete();
        }
        return false;
    }
}
