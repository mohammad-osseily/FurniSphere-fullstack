<?php

namespace App\Http\Controllers;

use App\Models\ShoppingCart;
use Illuminate\Support\Facades\Auth;

class ShoppingCartController extends Controller
{
    public function show()
    {
        $cart = ShoppingCart::with(['cartProducts.product.category'])
            ->where('user_id', Auth::id())
            ->first();

        if (!$cart) {
            return response()->json([
                'status' => 'error',
                'message' => 'Shopping cart not found',
            ], 404);
        }

        $subTotal = $cart->cartProducts->sum(function($cartProduct) {
            return $cartProduct->product->price * $cartProduct->quantity;
        });

        $taxes = $subTotal * 0.10; // 10% tax
        $deliveryPrice = 0; // Adjust this based on your logic
        $total = $subTotal + $taxes + $deliveryPrice;

        return response()->json([
            'status' => 'success',
            'cart' => $cart,
            'sub_total' => round($subTotal, 2),
            'taxes' => round($taxes, 2),
            'delivery_price' => round($deliveryPrice, 2),
            'total' => round($total, 2),
        ], 200);
    }



    // Clear the user's shopping cart
    public function clear()
    {
        $cart = ShoppingCart::where('user_id', Auth::id())->first();

        if (!$cart) {
            return response()->json([
                'status' => 'error',
                'message' => 'Shopping cart not found',
            ], 404);
        }

        $cart->cartProducts()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Shopping cart cleared',
        ], 200);
    }
}
