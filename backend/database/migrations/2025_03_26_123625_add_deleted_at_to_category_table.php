<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDeletedAtToCategoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('category', function (Blueprint $table) {
            $table->softDeletes(); 
        });
    }
    
    public function down()
    {
        Schema::table('category', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });
    }
}
