<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingAddress extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $table = 'shipping_address';

    protected $fillable = [
        'fullname',
        'phone',
        'provinces',
        'districts',
        'wards',
        'addresses',
        'user_id',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
