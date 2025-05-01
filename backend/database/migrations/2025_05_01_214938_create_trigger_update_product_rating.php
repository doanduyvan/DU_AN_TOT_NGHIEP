<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateTriggerUpdateProductRating extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::unprepared('
        CREATE TRIGGER trg_update_product_rating
        AFTER INSERT ON comment_products
        FOR EACH ROW
        BEGIN
            -- Cộng tổng số lượt đánh giá (kể cả comment trả lời)
            UPDATE products
            SET total_reviews = total_reviews + 1
            WHERE id = NEW.product_id;

            -- Nếu là comment gốc và có rating thì cập nhật lại trung bình sao
            IF NEW.rating IS NOT NULL AND NEW.comment_product_id IS NULL THEN
                UPDATE products
                SET rating_avg = (
                    SELECT AVG(rating)
                    FROM comment_products
                    WHERE product_id = NEW.product_id
                      AND rating IS NOT NULL
                      AND comment_product_id IS NULL
                )
                WHERE id = NEW.product_id;
            END IF;
        END;
    ');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::unprepared('DROP TRIGGER IF EXISTS trg_update_product_rating');
    }
}
