// app/services/orderServices.ts
import axios from "axios";
import { getTokenFromLocalStorage } from "./authServices";

const API_URL = "http://127.0.0.1:8000/api";

// Add product to cart
export const addToCart = async (productId: number, quantity: number) => {
  const token = getTokenFromLocalStorage();
  const response = await axios.post(
    `${API_URL}/cart/products/add`,
    {
      product_id: productId,
      quantity: quantity,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Clear the cart
export const clearCart = async () => {
  const token = getTokenFromLocalStorage();
  const response = await axios.post(
    `${API_URL}/cart/clear`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
export const getCart = async () => {
  const token = getTokenFromLocalStorage();
  const response = await axios.get(`${API_URL}/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const removeFromCart = async (productId: number) => {
  const token = getTokenFromLocalStorage();
  const response = await axios.post(
    `${API_URL}/cart/products/${productId}/delete`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateCartQuantity = async (
  productId: number,
  quantity: number
) => {
  const token = getTokenFromLocalStorage();
  const response = await axios.post(
    `${API_URL}/cart/products/${productId}/update`,
    {
      quantity,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
export const submitOrder = async (orderData: any) => {
  const token = getTokenFromLocalStorage();
  const response = await axios.post(
    "http://127.0.0.1:8000/api/orders/create",
    orderData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getOrderHistory = async () => {
  const token = getTokenFromLocalStorage();
  const response = await axios.get(`${API_URL}/orders/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
// Fetch all orders
export const getAllOrders = async () => {
  const token = getTokenFromLocalStorage();
  const response = await axios.get(`${API_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  const token = getTokenFromLocalStorage();
  const response = await axios.post(
    `${API_URL}/orders/${orderId}/update`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
export const cancelOrder = async (orderId: number) => {
  const token = getTokenFromLocalStorage();

  const response = await axios.post(
    `${API_URL}/orders/${orderId}/cancel`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
  
};