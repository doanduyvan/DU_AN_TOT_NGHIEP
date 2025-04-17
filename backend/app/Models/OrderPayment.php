<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderPayment extends Model
{
    protected $table = 'order_payments';
    protected $fillable = [
        'transaction_no',
        'bank_code',
        'amount',
        'status',
        'method',
        'pay_date',
        'order_id',
    ];

    protected $casts = [
        'pay_date' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
