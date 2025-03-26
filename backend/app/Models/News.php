<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class News extends Model
{
    use HasFactory, SoftDeletes;
    protected $dates = ['deleted_at'];
    protected $table = 'news';
    protected $fillable = ['title', 'avatar', 'content', 'category_news_id', 'user_id'];
    public function category()
    {
        return $this->belongsTo(CategoryNews::class, 'category_news_id', 'id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    // public function comments()
    // {
    //     return $this->hasMany(Comment::class, 'news_id', 'id');
    // }

}
