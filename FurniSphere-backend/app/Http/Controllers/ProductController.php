<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show']]);
    }

    // List All Products
    public function index(Request $request)
    {
        // Paginate the results, 10 products per page by default
        $products = Product::paginate(10);

        return response()->json($products, 200);
    }

    // Show Single Product
    public function show($id)
    {
        $product = Product::find($id);

        if(!$product){
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'product' => $product,
        ]);
    }

    // Create New Product (Admin Only)
    public function store(Request $request)
    {
        if (Gate::denies('isAdmin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access',
            ], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|string',
            'color' => 'nullable|string|max:50',
        ]);

        $product = Product::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Product created successfully',
            'product' => $product,
        ], 201);
    }

    // Update Existing Product (Admin Only)
    public function update(Request $request, $id)
    {
        if (Gate::denies('isAdmin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access',
            ], 403);
        }

        $product = Product::find($id);

        if(!$product){
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found',
            ], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'price' => 'sometimes|numeric',
            'category_id' => 'sometimes|exists:categories,id',
            'image' => 'sometimes|nullable|url',
            'color' => 'sometimes|string|max:50',
        ]);

        $product->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Product updated successfully',
            'product' => $product,
        ]);
    }

    // Delete Product (Admin Only)
    public function destroy($id)
    {
        if (Gate::denies('isAdmin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access',
            ], 403);
        }

        $product = Product::find($id);

        if(!$product){
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found',
            ], 404);
        }

        $product->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Product deleted successfully',
        ]);
    }
    public function getProductsWith3DModels() {
        $products = Product::with('product3d')->get();
        return response()->json($products);
    }

}

