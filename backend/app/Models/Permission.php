<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Traits\HasPermissions;

class Permission extends Model
{
    use HasFactory, SoftDeletes, HasPermissions;
    protected $dates = ['deleted_at'];
    protected $table = 'permissions';
    protected $fillable = ['name', 'guard_name'];
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_has_permissions', 'permission_id', 'role_id');
    }
    public function users()
    {
        return $this->belongsToMany(User::class, 'model_has_permissions', 'permission_id', 'model_id');
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
            return $query->where('name', 'LIKE', '%' . $keyword . '%');
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
