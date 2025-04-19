<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;
    protected $fillable = [
        'img',
        'link',
    ];
    protected $table = 'banners';

    public function scopeApplyFilters($query,  $filters)
    {
        $query->when($filters['sortorder'] ?? 'desc', function ($query, $sort) {
            return $query->orderBy('created_at', $sort);
        });
        return $query->paginate($filters['per_page'] ?? 10);
    }
    public function scopePaginate($query, $perPage)
    {
        return $query->paginate($perPage);
    }
}
