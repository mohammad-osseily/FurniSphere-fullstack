<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product3D extends Model
{
    use HasFactory;

    protected $table = 'product3ds'; // Explicitly define the table name

    protected $fillable = [
        'product_id',
        'model_file_path',
        'position',
        'scale',
        'rotation',
    ];

    protected $casts = [
        'position' => 'array',
        'scale' => 'array',
        'rotation' => 'array',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
