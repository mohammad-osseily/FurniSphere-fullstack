import axios from "axios";
import { getTokenFromLocalStorage } from "./authServices";
import { Product3D } from "@/types";

const API_URL = "http://127.0.0.1:8000/api"; // Adjust to your backend URL

export const fetchAll3DProducts = async (): Promise<Product3D[]> => {
  try {
    const response = await axios.get(`${API_URL}/product3ds`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching 3D products:", error);
    throw error;
  }
};

export const fetch3DProduct = async (id: number): Promise<Product3D> => {
  try {
    const response = await axios.get(`${API_URL}/product3ds/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching 3D product with id ${id}:`, error);
    throw error;
  }
};

// Create a new 3D product
export const create3DProduct = async (
  productData: FormData
): Promise<Product3D> => {
  const token = getTokenFromLocalStorage();
  try {
    const response = await axios.post(`${API_URL}/product3ds`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating 3D product:", error);
    throw error;
  }
};

export const update3DProductPosition = async (
  id: number,
  position: { x: number; y: number; z: number }
): Promise<Product3D> => {
  const token = getTokenFromLocalStorage();
  try {
    const response = await axios.post(
      `${API_URL}/product3ds/${id}/position`,
      position,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating position of 3D product with id ${id}:`,
      error
    );
    throw error;
  }
};

export const update3DProductScale = async (
  id: number,
  scale: { x: number; y: number; z: number }
): Promise<Product3D> => {
  const token = getTokenFromLocalStorage();
  try {
    const response = await axios.patch(
      `${API_URL}/product3ds/${id}/scale`,
      scale,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating scale of 3D product with id ${id}:`, error);
    throw error;
  }
};

export const update3DProductRotation = async (
  id: number,
  rotation: { x: number; y: number; z: number }
): Promise<Product3D> => {
  const token = getTokenFromLocalStorage();
  try {
    const response = await axios.patch(
      `${API_URL}/product3ds/${id}/rotation`,
      rotation,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating rotation of 3D product with id ${id}:`,
      error
    );
    throw error;
  }
};

export const delete3DProduct = async (id: number): Promise<void> => {
  const token = getTokenFromLocalStorage();
  try {
    await axios.delete(`${API_URL}/product3ds/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(`Error deleting 3D product with id ${id}:`, error);
    throw error;
  }
};
