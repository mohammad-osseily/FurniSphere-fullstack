<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Product3D;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class Product3DController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show']]);
    }

    // List All 3D Products
    public function index(Request $request)
    {
        $product3ds = Product3D::with('product:id,name')->get();
        return response()->json($product3ds, 200);
    }

    // Show Single 3D Product
    public function show($id)
    {
        $product3d = Product3D::with('product:id,name')->findOrFail($id);

        if (!$product3d) {
            return response()->json([
                'status' => 'error',
                'message' => '3D Product not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'product3d' => $product3d,
        ]);
    }

    // Create New 3D Product (Admin Only)
    public function store(Request $request)
    {
        if (Gate::denies('isAdmin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access',
            ], 403);
        }

        $request->validate([
            'product_id' => 'required|exists:products,id',
            'model_file_path' => 'required|string',
            'position' => 'nullable|array',
            'scale' => 'nullable|array',
            'rotation' => 'nullable|array',
        ]);

        $product3d = Product3D::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => '3D Product created successfully',
            'product3d' => $product3d,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        if (Gate::denies('isAdmin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access',
            ], 403);
        }

        $product3d = Product3D::find($id);

        if (!$product3d) {
            return response()->json([
                'status' => 'error',
                'message' => '3D Product not found',
            ], 404);
        }

        // Validate request
        $request->validate([
            'position' => 'sometimes|array',  // Ensure position is validated as an array
            'scale' => 'sometimes|array',
            'rotation' => 'sometimes|array',
        ]);

        // Update the product's position
        $product3d->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => '3D Product updated successfully',
            'product3d' => $product3d,
        ]);
    }


    // Delete 3D Product (Admin Only)
    public function destroy($id)
    {
        if (Gate::denies('isAdmin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access',
            ], 403);
        }

        $product3d = Product3D::find($id);

        if (!$product3d) {
            return response()->json([
                'status' => 'error',
                'message' => '3D Product not found',
            ], 404);
        }

        $product3d->delete();

        return response()->json([
            'status' => 'success',
            'message' => '3D Product deleted successfully',
        ]);
    }

    // Get all products with their associated 3D models
    public function getProductsWith3DModels()
    {
        $products = Product::with('product3d')->get();
        return response()->json($products);
    }

    public function updatePosition(Request $request, $id)
{
    $product3d = Product3D::find($id);

    if(!$product3d) {
        return response()->json(['error' => '3D Product not found'], 404);
    }

    $request->validate([
        'x' => 'required|numeric',
        'y' => 'required|numeric',
        'z' => 'required|numeric',
    ]);

    $product3d->position = ['x' => $request->x, 'y' => $request->y, 'z' => $request->z];
    $product3d->save();

    return response()->json(['message' => 'Position updated successfully', 'product3d' => $product3d]);
}

}
