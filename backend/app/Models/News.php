<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class News extends Model
{
    use HasFactory, SoftDeletes;
    protected $dates = ['deleted_at'];
    protected $table = 'news';
    protected $fillable = ['title', 'avatar', 'content', 'category_news_id', 'user_id'];
    public function category()
    {
        return $this->belongsTo(CategoryNews::class, 'category_news_id', 'id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
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
            return $query->where('title', 'LIKE', '%' . $keyword . '%');
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
        $news = $query->withTrashed()->where('id', $id)->first();
        if ($news) {
            if ($news->avatar && Storage::disk('public')->exists($news->avatar)) {
                Storage::disk('public')->delete($news->avatar);
            }
            return $news->forceDelete();
        }
        return false;
    }
}
