<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 *
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string $price
 * @property int|null $category_id
 * @property string|null $image
 * @property string|null $color
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\UserActivity> $activities
 * @property-read int|null $activities_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CartProduct> $cartProducts
 * @property-read int|null $cart_products_count
 * @property-read \App\Models\Category|null $category
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrderItem> $orderItems
 * @property-read int|null $order_items_count
 * @property-read \App\Models\Product3d|null $product3d
 * @method static \Illuminate\Database\Eloquent\Builder|Product newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Product newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Product query()
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'price', 'category_id', 'image', 'color', 'stock'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function product3d(): HasOne
    {
        return $this->hasOne(Product3d::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function cartProducts(): HasMany
    {
        return $this->hasMany(CartProduct::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(UserActivity::class);
    }
}
