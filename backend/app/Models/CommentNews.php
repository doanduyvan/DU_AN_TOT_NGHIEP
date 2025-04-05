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
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('comment_news', 'like', '%' . $search . '%');
        });
    }
    public function scopeSort($query, array $sort)
    {
        $query->when($sort['sort'] ?? false, function ($query, $sort) {
            return $query->orderBy('created_at', $sort);
        });
    }
    public function scopePaginate($query, $perPage = 10)
    {
        return $query->paginate($perPage);
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
    public function scopeRestore($query)
    {
        return $query->restore();
    }
    public function scopeForceDelete($query)
    {
        return $query->forceDelete();
    }
}
