<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Models\Permission;
use App\Models\ShippingAddress;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, SoftDeletes;

    protected $dates = ['deleted_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'fullname',
        'email',
        'password',
        'phone',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    public function shippingAddresses()
    {
        return $this->hasMany(ShippingAddress::class);
    }
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
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
            return $query->where('fullname', 'LIKE', '%' . $keyword . '%')
                ->orWhere('email', 'LIKE', '%' . $keyword . '%');
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

    public function hasPurchasedProduct($productId)
    {
        return OrderDetail::whereHas('order', function ($query) {
            $query->where('user_id', $this->id)
                ->where('status', 6);
        })
            ->whereHas('productvariant', function ($query) use ($productId) {
                $query->where('product_id', $productId);
            })
            ->exists();
    }
}
