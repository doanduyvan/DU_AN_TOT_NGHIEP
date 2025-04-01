<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommentProduct extends Model
{
    use HasFactory;
    protected $fillable = [
        'content',
        'rating',
        'product_id',
        'user_id',
        'comment_product_id',
    ];
    protected $table = 'comment_products';
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('comment', 'like', '%' . $search . '%');
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
        return $query->with(['product', 'user']);
    }
    public function scopeWithCount($query)
    {
        return $query->withCount(['product', 'user']);
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
