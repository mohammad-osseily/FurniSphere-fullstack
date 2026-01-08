<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderItemController extends Controller
{
    // Get all order items (for admin or user to view details of their own order)
    public function index($orderId)
    {
        $orderItems = OrderItem::where('order_id', $orderId)->get();

        return response()->json([
            'status' => 'success',
            'order_items' => $orderItems,
        ], 200);
    }

    // Get a single order item
    public function show($orderId, $id)
    {
        $orderItem = OrderItem::where('order_id', $orderId)->where('id', $id)->first();

        if (!$orderItem) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order item not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'order_item' => $orderItem,
        ], 200);
    }

    // No create/store method as order items are typically created as part of the order creation process

    // Update order item (e.g., by admin)
    public function update(Request $request, $orderId, $id)
    {
        $orderItem = OrderItem::where('order_id', $orderId)->where('id', $id)->first();

        if (!$orderItem) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order item not found',
            ], 404);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric',
        ]);

        $orderItem->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Order item updated successfully',
            'order_item' => $orderItem,
        ], 200);
    }

    // Delete an order item
    public function destroy($orderId, $id)
    {
        $orderItem = OrderItem::where('order_id', $orderId)->where('id', $id)->first();

        if (!$orderItem) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order item not found',
            ], 404);
        }

        $orderItem->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Order item deleted successfully',
        ], 200);
    }
}
