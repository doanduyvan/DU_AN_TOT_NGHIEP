<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderPaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('order_payments', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_no')->nullable(); // mã giao dịch VNPAY
            $table->string('bank_code')->nullable();      // ngân hàng thanh toán
            $table->decimal('amount', 12, 2);
            $table->tinyInteger('status')->default(0);     // 1 = thành công, 0 = thất bại
            $table->string('method')->default('vnpay');    // cổng thanh toán
            $table->dateTime('pay_date')->nullable();
            $table->unsignedBigInteger('order_id');
            $table->timestamps();
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('order_payments');
    }
}
