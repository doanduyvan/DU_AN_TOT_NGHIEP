<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CommentProduct extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'content',
        'rating',
        'product_id',
        'is_verified_buyer',
        'is_admin',
        'user_id',
        'comment_product_id',
    ];
    protected $dates = ['deleted_at'];
    protected $table = 'comment_products';

    protected $casts = [
        'is_admin' => 'boolean',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
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
            ->orWhereHas('product', function ($q) use ($keyword) {
                $q->where('product_name', 'LIKE', '%' . $keyword . '%');
            });
        }
        return $query;
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

    public function replies()
    {
        return $this->hasMany(CommentProduct::class, 'comment_product_id');
    }
}
