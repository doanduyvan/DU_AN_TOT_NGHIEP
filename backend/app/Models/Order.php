<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $table = 'orders';
    protected $fillable = ['order_date', 'total_amount', 'status', 
    'payment_method', 'shipping_address', 'user_id', 'fullname', 
    'phone', 'carrier', 'tracking_number', 'shipping_fee', 'payment_status', 'shipping_status'];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'order_id');
    }


}
