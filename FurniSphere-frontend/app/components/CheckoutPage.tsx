// app/components/CheckoutPage.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "../services/orderServices";

const CheckoutPage = () => {
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [comment, setComment] = useState("");
  const router = useRouter();

  const handleOrderSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await createOrder(addressLine, city, comment);
      alert("Order placed successfully!");
      router.push("/profile"); // Navigate to the profile page after order
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place the order.");
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <form onSubmit={handleOrderSubmit}>
        <div className="mb-4">
          <label className="block text-lg font-medium">Address Line</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded"
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium">City</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium">Comment</label>
          <textarea
            className="w-full px-4 py-2 border rounded"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
