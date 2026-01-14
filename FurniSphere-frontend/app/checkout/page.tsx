"use client";

import { useEffect, useState } from "react";
import { getCart, submitOrder, clearCart } from "../services/orderServices";
import Swal from "sweetalert2";
import { Cart } from "@/types/cart";
import { CartProduct } from "@/types/cartProduct";
import { useRouter } from "next/navigation";
import { ShoppingBag, Truck, CreditCard, Loader2, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const CheckoutPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [errors, setErrors] = useState<{ address_line?: string[]; city?: string[] }>({});
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
    // Reset errors
    setErrors({});

    // Client-side validation
    const validationErrors: { address_line?: string[]; city?: string[] } = {};
    
    if (!address.trim()) {
      validationErrors.address_line = ["The address line field is required."];
    }
    
    if (!city.trim()) {
      validationErrors.city = ["The city field is required."];
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!cart || cart.cart_products.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setSubmitting(true);

    const orderData = {
      address_line: address.trim(),
      city: city.trim(),
      comment: comment.trim(),
      items: cart.cart_products.map((item: CartProduct) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    };

    try {
      await submitOrder(orderData);
      await clearCart();
      toast.success("Your order has been placed successfully!");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error: any) {
      console.error("Failed to place order:", error);
      
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        const errorMessages = Object.values(error.response.data.errors).flat();
        toast.error(errorMessages.join(", "));
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-neutral">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-neutral mb-8 text-center">Checkout</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-base-200 p-6 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold text-neutral mb-6 flex items-center">
                <Truck className="mr-3 w-6 h-6 text-primary" /> Shipping Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral mb-2">
                    Address Line <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your street address"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address_line) {
                        setErrors((prev) => ({ ...prev, address_line: undefined }));
                      }
                    }}
                    required
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition-colors ${
                      errors.address_line
                        ? "border-error focus:ring-error"
                        : "border-base-300 focus:ring-primary"
                    }`}
                  />
                  {errors.address_line && (
                    <div className="mt-2 flex items-center gap-2 text-error text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.address_line[0]}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral mb-2">
                    City <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your city"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city) {
                        setErrors((prev) => ({ ...prev, city: undefined }));
                      }
                    }}
                    required
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition-colors ${
                      errors.city
                        ? "border-error focus:ring-error"
                        : "border-base-300 focus:ring-primary"
                    }`}
                  />
                  {errors.city && (
                    <div className="mt-2 flex items-center gap-2 text-error text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.city[0]}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral mb-2">
                    Additional Comments (Optional)
                  </label>
                  <textarea
                    placeholder="Any special delivery instructions?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border border-base-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none"
                    rows={4}
                  />
                </div>
              </div>
            </div>
            <div className="bg-base-200 p-6 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold text-neutral mb-6 flex items-center">
                <ShoppingBag className="mr-3 w-6 h-6 text-primary" /> Order Items
              </h3>
              <div className="space-y-4">
                {cart?.cart_products.map((item: CartProduct) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 border-b border-base-300 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-neutral">{item.product.name}</p>
                      <p className="text-sm text-neutral">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-primary text-lg">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="bg-base-200 p-6 rounded-xl shadow-sm sticky top-8">
              <h3 className="text-2xl font-bold text-neutral mb-6 flex items-center">
                <CreditCard className="mr-3 w-6 h-6 text-primary" /> Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-neutral">
                  <span>Sub Total:</span>
                  <span className="font-semibold">${roundedSubTotal}</span>
                </div>
                <div className="flex justify-between text-neutral">
                  <span>Taxes:</span>
                  <span className="font-semibold">${taxes}</span>
                </div>
                <div className="flex justify-between text-neutral">
                  <span>Delivery Price:</span>
                  <span className="font-semibold">${deliveryPrice.toFixed(2)}</span>
                </div>
                <hr className="my-4 border-base-300" />
                <div className="flex justify-between font-bold text-xl text-neutral">
                  <span>Total:</span>
                  <span className="text-primary">${total}</span>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={submitting || !cart || cart.cart_products.length === 0}
                className="w-full py-4 mt-6 bg-primary text-base-200 rounded-xl font-medium hover:bg-primary/90 active:bg-primary/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Placing Order...</span>
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
