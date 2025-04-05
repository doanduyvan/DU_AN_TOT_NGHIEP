<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CategoryNews extends Model
{
    use HasFactory, SoftDeletes;

    protected $dates = ['deleted_at'];
    protected $table = 'category_news';
    protected $fillable = ['category_news_name', 'img'];
    public function news()
    {
        return $this->hasMany(News::class, 'category_news_id');
    }
}
