<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CategoryNews extends Model
{
    use HasFactory, SoftDeletes;

    protected $dates = ['deleted_at'];
    protected $table = 'category_news';
    protected $fillable = ['category_news_name', 'img'];
    public function news()
    {
        return $this->hasMany(Product::class, 'category_news_id', 'id');
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
            return $query->where('category_news_name', 'LIKE', '%' . $keyword . '%');
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
        // Chỉ xóa những bản ghi đã bị xóa mềm
        return $query->withTrashed()
            ->where('id', $id)
            ->forceDelete();
    }
}
