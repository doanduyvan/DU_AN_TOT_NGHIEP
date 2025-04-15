<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('wards', function (Blueprint $table) {
            $table->string('code', 20)->primary();
            $table->string('name');
            $table->string('name_en')->nullable();
            $table->string('full_name')->nullable();
            $table->string('full_name_en')->nullable();
            $table->string('code_name')->nullable();
            $table->string('district_code', 20)->nullable();
            $table->integer('administrative_unit_id')->nullable();
            
            $table->foreign('district_code')
                  ->references('code')
                  ->on('districts')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('wards');
    }
};