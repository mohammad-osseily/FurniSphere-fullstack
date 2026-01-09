// app/services/userActivityService.ts

import axios from "axios";
import { getTokenFromLocalStorage } from "./authServices";

const API_URL = "http://127.0.0.1:8000/api"; // Adjust to your backend URL

export const trackUserActivity = async (
  productId: number,
  interactionType: string
): Promise<void> => {
  try {
    const token = getTokenFromLocalStorage(); // Get the auth token from local storage

    // If no token, user is not authenticated, silently skip tracking
    if (!token) {
      return;
    }

    await axios.post(
      `${API_URL}/user-activities`,
      {
        product_id: productId,
        interaction_type: interactionType,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the headers for authorization
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    // Handle 401 (Unauthorized) and 403 (Forbidden) errors gracefully
    // These occur when token is invalid/expired or user is not authenticated
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      // Silently fail - user is not authenticated or token is invalid
      // Don't log or throw to avoid cluttering console with auth errors
      return;
    }
    
    // Only log other errors (network issues, server errors, etc.)
    // Don't throw to prevent breaking the user experience
    if (error?.response?.status !== 401 && error?.response?.status !== 403) {
      console.error("Error tracking user activity:", error);
    }
  }
};
