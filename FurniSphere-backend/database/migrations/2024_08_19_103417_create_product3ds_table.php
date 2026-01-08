<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if(!Schema::hasTable("product3ds")){
            Schema::create('product3ds', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('product_id');
                $table->string('model_file_path');
                $table->json('position')->default(NULL);
                $table->json('scale')->default(NULL);
                $table->json('rotation')->default(NULL);
                $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product3ds');
    }
};
