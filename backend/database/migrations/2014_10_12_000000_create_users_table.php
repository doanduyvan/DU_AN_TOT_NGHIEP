<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('avatar')->nullable();
            $table->string('fullname');
            $table->string('email')->unique()->nullable();
            $table->string('password')->nullable();
            $table->boolean('is_verify')->default(false);
            $table->integer('status')->default(1);  // Hoặc có thể là enum/integer tùy nhu cầu
            $table->integer('role')->default(0);
            $table->boolean('is_root')->default(false);
            $table->string('phone')->nullable();
            $table->timestamps(); // Tạo cột created_at và updated_at
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
        Schema::dropIfExists('users');
    }
}
