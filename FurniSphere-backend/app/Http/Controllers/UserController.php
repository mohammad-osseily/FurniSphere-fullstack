<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator; // Add this import

class UserController extends Controller
{
    // Get the authenticated user's profile
    public function profile()
    {
        $user = Auth::user();

        return response()->json([
            'status' => 'success',
            'user' => $user,
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($request->has('email')) {
            $user->email = $request->email;
        }

        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }



    // List all users with pagination (Admin only)
    public function index()
    {
        if (Gate::denies('isAdmin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access',
            ], 403);
        }

        $users = User::paginate(10);

        return response()->json([
            'status' => 'success',
            'users' => $users,
        ], 200);
    }
    public function updateUser(Request $request, $id)
    {
        // Check if the authenticated user is an admin
        if (Gate::denies('isAdmin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access',
            ], 403);
        }

        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'role' => 'required|string|in:user,admin', // Ensure 'role' is either 'user' or 'admin'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 400);
        }

        // Find the user
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found',
            ], 404);
        }

        // Update user details
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->role = $request->input('role');
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'User updated successfully',
            'user' => $user,
        ], 200);
    }

    // Delete User (Admin Only)
    public function deleteUser($id)
    {
        // Check if the authenticated user is an admin
        if (Gate::denies('isAdmin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access',
            ], 403);
        }

        // Find the user
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found',
            ], 404);
        }

        // Delete the user
        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'User deleted successfully',
        ], 200);
    }
}


