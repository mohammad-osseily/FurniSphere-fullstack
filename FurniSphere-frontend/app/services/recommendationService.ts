// app/services/recommendationService.ts

import axios from "axios";
import { getTokenFromLocalStorage } from "./authServices";
import { Product } from "@/types";

const API_URL = "http://127.0.0.1:8000/api"; // Adjust to your backend URL

/**
 * Fetch recommended products for the authenticated user.
 * @returns A promise that resolves to a list of recommended products.
 */
export const fetchRecommendations = async (): Promise<Product[]> => {
  try {
    const token = getTokenFromLocalStorage(); // Get the auth token from local storage

    const response = await axios.get(`${API_URL}/recommendations`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the headers for authorization
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};
