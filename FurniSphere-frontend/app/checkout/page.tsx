"use client";

import { useEffect, useState } from "react";
import { getCart, submitOrder, clearCart } from "../services/orderServices";
import Swal from "sweetalert2";
import { Cart } from "@/types/cart";
import { CartProduct } from "@/types/cartProduct";
import { useRouter } from "next/navigation";
import { ShoppingBag, Truck, CreditCard } from "lucide-react";

const CheckoutPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await getCart();
        setCart(cartData.cart);
      } catch (error) {
        console.error("Failed to load cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const calculateSubTotal = () => {
    if (!cart) return 0;
    return cart.cart_products.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  const roundedSubTotal = calculateSubTotal().toFixed(2);
  const taxes = (calculateSubTotal() * 0.1).toFixed(2);
  const deliveryPrice = 10.0;
  const total = (
    parseFloat(roundedSubTotal) +
    parseFloat(taxes) +
    deliveryPrice
  ).toFixed(2);

  const handlePlaceOrder = async () => {
    if (!cart || cart.cart_products.length === 0) {
      Swal.fire("Error", "Your cart is empty", "error");
      return;
    }

    const orderData = {
      address_line: address,
      city: city,
      comment: comment,
      items: cart.cart_products.map((item: CartProduct) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    };

    try {
      await submitOrder(orderData);
      await clearCart();
      Swal.fire(
        "Success",
        "Your order has been placed successfully!",
        "success"
      ).then(() => {
        if (typeof window !== "undefined") {
          router.push("/");
        }
      });
    } catch (error) {
      Swal.fire("Error", "Failed to place order. Please try again.", "error");
      console.error("Failed to place order:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-0">
      <h2 className="text-3xl font-semibold mb-6 text-center">Checkout</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Truck className="mr-2" /> Shipping Information
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Address Line"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Additional Comments"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <ShoppingBag className="mr-2" /> Order Items
            </h3>
            <div className="space-y-4">
              {cart?.cart_products.map((item: CartProduct) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <CreditCard className="mr-2" /> Order Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sub Total:</span>
                <span>${roundedSubTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes:</span>
                <span>${taxes}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Price:</span>
                <span>${deliveryPrice.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${total}</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handlePlaceOrder}
                className="w-full py-3 mt-6 bg-primary text-white rounded-lg hover:opacity-90 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
