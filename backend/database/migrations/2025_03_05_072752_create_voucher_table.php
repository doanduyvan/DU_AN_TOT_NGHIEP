<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVoucherTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('voucher', function (Blueprint $table) {
            $table->id();  
            $table->string('code')->unique();  // Mã voucher, đặt unique nếu muốn
            $table->string('title');
            $table->integer('quantity')->default(0);
            $table->integer('quantity_used')->default(0);
            $table->integer('status')->default(1); // Hoặc có thể dùng enum/boolean tùy ý
            $table->dateTime('expiry_date'); // Hoặc date, tùy nhu cầu
            $table->decimal('discount_value', 12, 2)->default(0); // Giá trị giảm giá
            $table->integer('discount_type')->default(0); // Loại giảm giá (percent, fixed, v.v.)

            // Khóa ngoại đến bảng users
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Tạo 2 cột created_at và updated_at
            $table->timestamps();
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
        Schema::dropIfExists('voucher');
    }
}
