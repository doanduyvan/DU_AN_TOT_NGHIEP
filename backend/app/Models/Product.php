<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $table = 'products';

    protected $fillable = ['product_name', 'description', 'avatar','category_id', 'user_id'];
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id'); 
    }
    public function user()
    {
        return $this->belongsToMany(User::class, 'user_id');
    }
    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }
    public function variants()
    {
        return $this->hasMany(ProductVariant::class, 'product_id');
    }
}
