<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNewsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->text('avatar')->nullable();
            $table->text('title');
            $table->longText('content');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('category_news_id');
            $table->timestamps();

            // Khóa ngoại
            $table->foreign('user_id')
                ->references('id')->on('users');
            $table->foreign('category_news_id')
                ->references('id')->on('category_news');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('news');
    }
}
