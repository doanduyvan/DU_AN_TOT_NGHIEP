<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->dateTime('order_date')->nullable();
            $table->decimal('total_amount', 15, 2);
            $table->integer('status')->default(0);
            $table->string('payment_method')->nullable();
            $table->text('shipping_address')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('fullname');
            $table->string('phone');
            $table->string('carrier')->nullable();
            $table->string('tracking_number')->nullable();
            $table->decimal('shipping_fee', 12, 2)->nullable();
            $table->integer('payment_status')->default(0);
            $table->integer('shipping_status')->default(0);
            $table->text('note')->nullable();
            $table->tinyInteger('created_by_admin')->default(0);
            $table->timestamps();

            // Khóa ngoại
            $table->foreign('user_id')
                  ->references('id')->on('users')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
