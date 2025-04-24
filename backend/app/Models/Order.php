<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;
    protected $dates = ['deleted_at'];
    protected $table = 'orders';
    protected $fillable = [
        'order_date',
        'total_amount',
        'status',
        'payment_method',
        'shipping_address',
        'user_id',
        'fullname',
        'phone',
        'carrier',
        'tracking_number',
        'shipping_fee',
        'payment_status',
        'shipping_status',
        'note',
        'created_by_admin'
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function shippingAddress()
    {
        return $this->belongsTo(ShippingAddress::class);
    }
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'order_id');
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
    public function scopeFilterStatus($query, $filters)
    {
        if ($filters) {
            // Kiểm tra và chỉ áp dụng điều kiện nếu có giá trị hợp lệ
            if (!empty($filters['filter_status'])) {
                $query->where('status', $filters['filter_status']);
            }
    
            // Kiểm tra và chỉ áp dụng nếu có giá trị
            if (!empty($filters['filter_payment_status']) || !empty($filters['filter_shipping_status'])) {
                // Chỉ sử dụng orWhere khi ít nhất một trong các điều kiện tồn tại
                $query->where(function($q) use ($filters) {
                    if (!empty($filters['filter_payment_status'])) {
                        $q->orWhere('payment_status', $filters['filter_payment_status']);
                    }
                    if (!empty($filters['filter_shipping_status'])) {
                        $q->orWhere('shipping_status', $filters['filter_shipping_status']);
                    }
                });
            }
        }
    
        return $query;
    }
    

    public function scopeSearch($query, $keyword)
    {
        if (!empty($keyword)) {
            return $query->where('fullname', 'LIKE', '%' . $keyword . '%')
                ->orWhere('phone', 'LIKE', '%' . $keyword . '%')
            ;
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

    public function payments()
    {
        return $this->hasMany(OrderPayment::class, 'order_id', 'id');
    }
}
