// app/components/CartPage.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCart, removeFromCart } from "../services/orderServices";

const CartPage = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartResponse = await getCart();
        const products = cartResponse?.cart?.cart_products || [];
        setCartItems(products);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveFromCart = async (id: any) => {
    try {
      await removeFromCart(id);
      setCartItems(cartItems.filter((item: any) => item.id !== id));
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
      {cartItems.length > 0 ? (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.product_id} className="flex justify-between mb-4">
                <div>{item.name}</div>
                <div>${item.price}</div>
                <div>Quantity: {item.quantity}</div>
                <button onClick={() => handleRemoveFromCart(item.product_id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleCheckout}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Proceed to Checkout
          </button>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
