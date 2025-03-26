<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderDetail extends Model
{
    use HasFactory, SoftDeletes;
    protected $dates = ['deleted_at'];
    protected $table = 'order_details';
    protected $fillable = ['order_id', 'product_variant_id', 'quantity', 'price'];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
    public function productvariant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
    public $timestamps = false;
}
