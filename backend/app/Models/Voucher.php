<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Voucher extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'voucher';
    protected $dates = ['deleted_at'];
    protected $fillable = [
        'code',
        'title',
        'quantity',
        'quantity_used',
        'status',
        'expiry_date',
        'discount_value',
        'discount_type',
        'user_id'
    ];
    protected $casts = [
        'expiry_date' => 'datetime',
        'quantity' => 'integer',
        'quantity_used' => 'integer',
        'discount_value' => 'float',
        'user_id' => 'integer'
    ];
    public function scopePaginate($query, $perPage)
    {
        return $query->paginate($perPage);
    }
    public function scopeApplyFilters($query,  $filters)
    {
        $query->when($filters['sortorder'] ?? 'desc', function ($query, $sort) {
            return $query->orderBy('created_at', $sort);
        });
        return $query->paginate($filters['per_page'] ?? 10);
    }
    public function scopeSearch($query, $keyword)
    {
        if (!empty($keyword)) {
            return $query->where('code', 'LIKE', '%' . $keyword . '%')
                ->orWhere('title', 'LIKE', '%' . $keyword . '%');
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
        // Chỉ xóa những bản ghi đã bị xóa mềm
        return $query->withTrashed()
            ->where('id', $id)
            ->forceDelete();
    }
}
