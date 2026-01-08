<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UserActivity;
use App\Models\Product;

class UserActivityController extends Controller
{
    /**
     * Store a newly created user activity in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $userId = Auth::id();

        $validatedData = $request->validate([
            'product_id' => 'required|exists:products,id',
            'interaction_type' => 'required|string',
        ]);

        // Create the user activity record
        $activity = UserActivity::create([
            'user_id' => $userId,
            'product_id' => $validatedData['product_id'],
            'interaction_type' => $validatedData['interaction_type'],
        ]);

        // Increment product popularity
        $product = Product::find($validatedData['product_id']);
        $product->increment('popularity');

        return response()->json($activity, 201);
    }

    /**
     * Suggest products to the user based on their activity.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function recommendProducts(Request $request)
    {
        $userId = Auth::id();

        // Get the user's recent activities
        $activities = UserActivity::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->pluck('product_id')
            ->toArray();

        // If the user has no activity, recommend top-selling or new products
        if (empty($activities)) {
            $recommendedProducts = Product::orderBy('popularity', 'desc')
                ->take(4)
                ->get();
        } else {
            // Get the categories of the products the user has interacted with
            $categoryIds = Product::whereIn('id', $activities)
                ->pluck('category_id')
                ->unique()
                ->toArray();

            // Recommend products from these categories, excluding ones the user already interacted with
            $recommendedProducts = Product::whereIn('category_id', $categoryIds)
                ->whereNotIn('id', $activities)
                ->orderBy('popularity', 'desc') // You can rank by popularity, rating, or another attribute
                ->take(4)
                ->get();

            // If less than 4 products are found, fill the rest with top-selling or new products
            if ($recommendedProducts->count() < 4) {
                $additionalProducts = Product::whereNotIn('id', array_merge($activities, $recommendedProducts->pluck('id')->toArray()))
                    ->orderBy('popularity', 'desc')
                    ->take(4 - $recommendedProducts->count())
                    ->get();

                $recommendedProducts = $recommendedProducts->merge($additionalProducts);
            }
        }

        return response()->json($recommendedProducts);
    }
}
