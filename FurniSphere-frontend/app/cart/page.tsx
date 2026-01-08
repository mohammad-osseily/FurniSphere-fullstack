"use client";

import { useEffect, useState } from "react";
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../services/orderServices";
import { Cart } from "@/types/cart";
import { CartProduct } from "@/types/cartProduct";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const CartPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [subTotal, setSubTotal] = useState<string>("0.00");
  const [taxes, setTaxes] = useState<string>("0.00");
  const [deliveryPrice, setDeliveryPrice] = useState<string>("0.00");
  const [total, setTotal] = useState<string>("0.00");

  const fetchCart = async () => {
    try {
      const cartData = await getCart();
      setCart(cartData.cart);
      setSubTotal(cartData.sub_total);
      setTaxes(cartData.taxes);
      setDeliveryPrice(cartData.delivery_price);
      setTotal(cartData.total);
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (id: number, productName: string) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: `Do you want to remove ${productName} from your cart?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await removeFromCart(id);
          await fetchCart();
          toast.success(`${productName} has been removed from your cart.`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } catch (error) {
          console.error("Failed to remove item:", error);
          toast.error("Failed to remove item. Please try again.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }
    });
  };

  const handleQuantityChange = async (id: number, quantity: number) => {
    try {
      await updateCartQuantity(id, quantity);
      await fetchCart();
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update quantity. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!cart || cart.cart_products.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <ShoppingCart className="mx-auto h-24 w-24 text-gray-400 mb-4" />
        <h2 className="text-3xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Link
          href="/products"
          className="bg-primary text-white px-6 py-3 rounded-md hover:opacity-90 transition duration-300"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-10 lg:flex lg:space-x-10 lg:space-y-0">
      <ToastContainer />
      <div className="w-full lg:w-3/4">
        <h2 className="text-3xl font-semibold mb-6 text-center lg:text-left">
          Your Cart
        </h2>
        <div className="space-y-6">
          {cart.cart_products.map((item: CartProduct) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-lg shadow-md space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <img
                src={`/static/images/${item.product.image}.jpg`}
                alt={item.product.name}
                className="w-32 h-32 object-cover rounded-md"
              />
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-xl font-semibold">{item.product.name}</h3>
                <p className="text-gray-600">
                  Category: {item.product.category?.name || "N/A"}
                </p>
                <p className="text-gray-600">Color: {item.product.color}</p>
                <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2">
                  <button
                    className="p-1 border rounded-full hover:bg-gray-100 transition duration-300"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-lg font-medium w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    className="p-1 border rounded-full hover:bg-gray-100 transition duration-300"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-lg font-semibold">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
              <button
                className="text-red-600 hover:text-red-800 transition duration-300"
                onClick={() => handleRemove(item.id, item.product.name)}
                aria-label="Remove item"
              >
                <Trash2 className="h-6 w-6" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full lg:w-1/4">
        <h2 className="text-3xl font-semibold mb-6 text-center lg:text-left">
          Order Summary
        </h2>
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span>${subTotal}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery:</span>
            <span>${deliveryPrice}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Taxes:</span>
            <span>${taxes}</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span>${total}</span>
          </div>
          <Link href="/checkout" className="block">
            <button className="w-full py-3 mt-4 bg-primary text-white rounded-md hover:opacity-90 transition duration-300">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;