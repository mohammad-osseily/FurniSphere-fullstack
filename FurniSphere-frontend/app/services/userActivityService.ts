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
  } catch (error) {
    console.error("Error tracking user activity:", error);
    throw error;
  }
};
