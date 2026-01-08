<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class  extends Migration
{
    public function up()
    {
        if(!Schema::hasTable('cart_products')){
        Schema::create('cart_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cart_id');
            $table->unsignedBigInteger('product_id');
            $table->integer('quantity')->default(1);
            $table->foreign('cart_id')->references('id')->on('shopping_carts')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->timestamps();
        });
    }
    }

    public function down()
    {
        Schema::dropIfExists('cart_products');
    }
};
