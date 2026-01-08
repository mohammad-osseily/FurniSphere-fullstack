<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class CategoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show', 'getAllCategoriesWithProducts']]);
    }

    // List All Categories
    public function index()
    {
        $categories = Category::all();
        return response()->json([
            'status' => 'success',
            'categories' => $categories,
        ]);
    }
    public function getAllCategoriesWithProducts()
{
    $categories = Category::with('products')->get();

    return response()->json([
        'status' => 'success',
        'categories' => $categories,
    ]);
}

    // Show Single Category
    public function show($id)
{
    $category = Category::with('products')->find($id);

    if (!$category) {
        return response()->json([
            'status' => 'error',
            'message' => 'Category not found',
        ], 404);
    }

    return response()->json([
        'status' => 'success',
        'category' => $category,
    ]);
}

    // Create New Category (Admin Only)
    public function store(Request $request)
    {
        if (Gate::denies('isAdmin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access',
            ], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
        ]);

        $category = Category::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Category created successfully',
            'category' => $category,
        ], 201);
    }

    // Update Existing Category (Admin Only)
    public function update(Request $request, $id)
    {
        if (Gate::denies('isAdmin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access',
            ], 403);
        }

        $category = Category::find($id);

        if(!$category){
            return response()->json([
                'status' => 'error',
                'message' => 'Category not found',
            ], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255|unique:categories,name,'.$category->id,
            'description' => 'sometimes|nullable|string',
        ]);

        $category->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Category updated successfully',
            'category' => $category,
        ]);
    }

    // Delete Category (Admin Only)
    public function destroy($id)
    {
        if (Gate::denies('isAdmin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access',
            ], 403);
        }

        $category = Category::find($id);

        if(!$category){
            return response()->json([
                'status' => 'error',
                'message' => 'Category not found',
            ], 404);
        }

        $category->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Category deleted successfully',
        ]);
    }
}
