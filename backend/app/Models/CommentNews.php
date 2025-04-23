<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CommentNews extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'content',
        'news_id',
        'user_id',
        'is_admin',
        'comment_news_id',
    ];
    protected $dates = ['deleted_at'];
    protected $table = 'comment_news';
    public function news()
    {
        return $this->belongsTo(News::class, 'news_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
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
            $query->whereHas('user', function ($q) use ($keyword) {
                $q->where('fullname', 'LIKE', '%' . $keyword . '%');
            })
            ->orWhereHas('news', function ($q) use ($keyword) {
                $q->where('title', 'LIKE', '%' . $keyword . '%');
            });
        }
        return $query;
    }
    public function scopeWithRelations($query)
    {
        return $query->with(['news', 'user']);
    }
    public function scopeWithCount($query)
    {
        return $query->withCount(['news', 'user']);
    }
    public function scopeWithTrashed($query)
    {
        return $query->withTrashed();
    }
    public function scopeOnlyTrashed($query)
    {
        return $query->onlyTrashed();
    }
    public function scopeRestore($query, $id) {
        return $query->where('id', $id)->restore();
    }
    public function scopeForceDelete($query)
    {
        return $query->forceDelete();
    }

    public function replies()
    {
        return $this->hasMany(CommentNews::class, 'comment_news_id');
    }
    
}
