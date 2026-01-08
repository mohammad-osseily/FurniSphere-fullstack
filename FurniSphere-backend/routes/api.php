<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderItemController;
use App\Http\Controllers\CartProductController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\Product3DController;
use App\Http\Controllers\ShoppingCartController;
use App\Http\Controllers\UserActivityController;

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

Route::group(['prefix' => 'auth'], function () {
    Route::post('/register', [AuthController::class, 'register']); // User Registration
    Route::post('/login', [AuthController::class, 'login']);       // User Login
    Route::post('/logout', [AuthController::class, 'logout']);     // User Logout
    Route::post('/refresh', [AuthController::class, 'refresh']);   // Refresh Token
});

/*
|--------------------------------------------------------------------------
| User Routes
|--------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function () {
    Route::get('/user/profile', [UserController::class, 'profile']);              // Get User Profile
    Route::post('/user/profile/update', [UserController::class, 'updateProfile']); // Update User Profile
    Route::get('/users', [UserController::class, 'index'])->middleware('isAdmin'); // List All Users (Admin Only)
    Route::post('/users/{id}/update', [UserController::class, 'updateUser'])->middleware('isAdmin'); // Update User
    Route::post('/users/{id}/delete', [UserController::class, 'deleteUser'])->middleware('isAdmin'); // Delete User
});

/*
|--------------------------------------------------------------------------
| Product Routes
|--------------------------------------------------------------------------
*/

// Public routes for products
Route::get('/products', [ProductController::class, 'index']);                // List All Products
Route::get('/products/{id}', [ProductController::class, 'show']);            // Show Single Product

// Admin routes for managing products
Route::group(['middleware' => ['auth:api', 'isAdmin']], function () {
    Route::post('/products/create', [ProductController::class, 'store']);            // Create Product (Admin Only)
    Route::post('/products/{id}/update', [ProductController::class, 'update']);      // Update Product (Admin Only)
    Route::post('/products/{id}/delete', [ProductController::class, 'destroy']);     // Delete Product (Admin Only)
});

/*
|--------------------------------------------------------------------------
| Product3D Routes
|--------------------------------------------------------------------------
*/

// Public routes for 3D products
Route::get('/product3ds', [Product3DController::class, 'index']);                // List All 3D Products
Route::get('/product3ds/{id}', [Product3DController::class, 'show']);            // Show Single 3D Product

// Admin routes for managing 3D products
Route::group(['middleware' => ['auth:api', 'isAdmin']], function () {
    Route::post('/product3ds', [Product3DController::class, 'store']);                   // Create 3D Product (Admin Only)
    Route::put('/product3ds/{id}', [Product3DController::class, 'update']);              // Update 3D Product (Admin Only)
    Route::delete('/product3ds/{id}', [Product3DController::class, 'destroy']);          // Delete 3D Product (Admin Only)
});

/*
|--------------------------------------------------------------------------
| Chat Route
|--------------------------------------------------------------------------
*/

Route::post('/chat', [ChatController::class, 'chat']);

/*
|--------------------------------------------------------------------------
| Category Routes
|--------------------------------------------------------------------------
*/

// Public routes for categories
Route::get('/categories-with-products', [CategoryController::class, 'getAllCategoriesWithProducts']);

Route::get('/categories', [CategoryController::class, 'index']);               // List All Categories
Route::get('/categories/{id}', [CategoryController::class, 'show']);           // Show Single Category

// Admin routes for managing categories
Route::group(['middleware' => ['auth:api', 'isAdmin']], function () {
    Route::post('/categories/create', [CategoryController::class, 'store']);            // Create Category (Admin Only)
    Route::post('/categories/{id}/update', [CategoryController::class, 'update']);      // Update Category (Admin Only)
    Route::post('/categories/{id}/delete', [CategoryController::class, 'destroy']);     // Delete Category (Admin Only)
    Route::post('/product3ds/{id}/position', [Product3DController::class, 'updatePosition']);
});

/*
|--------------------------------------------------------------------------
| Order Routes
|--------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function () {
    // Admin routes for managing orders
    Route::group(['middleware' => 'isAdmin'], function () {
        Route::get('/orders', [OrderController::class, 'index']);                        // List All Orders (Admin Only)
        Route::post('/orders/{id}/update', [OrderController::class, 'update']);          // Update Order Status (Admin Only)
        Route::post('/orders/{id}/delete', [OrderController::class, 'destroy']);         // Delete Order (Admin Only)
    });

    // User routes for orders
    Route::get('/orders/history', [OrderController::class, 'orderHistory']);         // User's Order History
    Route::get('/orders/{id}', [OrderController::class, 'show']);                    // Show Single Order
    Route::post('/orders/create', [OrderController::class, 'store']);                // Create New Order
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancelOrder']);     // Cancel Order
});

/*
|--------------------------------------------------------------------------
| OrderItem Routes
|--------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function () {
    Route::get('/orders/{orderId}/items', [OrderItemController::class, 'index']); // List items in an order
    Route::get('/orders/{orderId}/items/{id}', [OrderItemController::class, 'show']); // Show single order item
    Route::post('/orders/{orderId}/items/{id}/update', [OrderItemController::class, 'update'])->middleware('isAdmin'); // Update order item (Admin)
    Route::post('/orders/{orderId}/items/{id}/delete', [OrderItemController::class, 'destroy'])->middleware('isAdmin'); // Delete order item (Admin)
});

/*
|--------------------------------------------------------------------------
| ShoppingCart and CartProduct Routes
|--------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function () {
    // CartProduct routes
    Route::get('/cart/products', [CartProductController::class, 'index']); // List all products in cart
    Route::post('/cart/products/add', [CartProductController::class, 'store']); // Add a product to the cart
    Route::post('/cart/products/{id}/update', [CartProductController::class, 'update']); // Update a product in the cart
    Route::post('/cart/products/{id}/delete', [CartProductController::class, 'destroy']); // Remove a product from the cart

    // ShoppingCart routes
    Route::get('/cart', [ShoppingCartController::class, 'show']); // View the shopping cart
    Route::post('/cart/clear', [ShoppingCartController::class, 'clear']); // Clear the shopping cart
});

/*
|--------------------------------------------------------------------------
| User Activity Routes
|--------------------------------------------------------------------------
*/

Route::group(['middleware' => 'auth:api'], function () {
    // User Activity Routes
    Route::post('/user-activities', [UserActivityController::class, 'store']);          // Record User Activity
    Route::get('/recommendations', [UserActivityController::class, 'recommendProducts']); // Get Recommendations
});

/*
|--------------------------------------------------------------------------
| Chat Route (Remove Duplicate if Necessary)
|--------------------------------------------------------------------------
*/

// Remove this if it's duplicated
// Route::post('/chat', [ChatController::class, 'chat']);
