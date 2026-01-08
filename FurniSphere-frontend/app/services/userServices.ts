import axios from "axios";
import { getTokenFromLocalStorage } from "./authServices";
import { User } from "@/types"; // Assuming you have a User type

const API_URL = "http://127.0.0.1:8000/api"; // Adjust to your backend URL

/**
 * Fetch all users (Admin only).
 * @returns A promise that resolves to a list of users.
 */
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const token = getTokenFromLocalStorage(); // Get the auth token from local storage
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the headers for authorization
      },
    });

    return response.data.users.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Update a user (Admin only).
 * @param id - User ID
 * @param userData - Data to update the user with (name, email, role)
 * @returns The updated user data.
 */
export const updateUser = async (
  id: number,
  userData: { name: string; email: string; role: string }
): Promise<User> => {
  const token = getTokenFromLocalStorage(); // Get the auth token from local storage
  try {
    const response = await axios.post(
      `${API_URL}/users/${id}/update`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the headers for authorization
        },
      }
    );
    return response.data.user;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a user (Admin only).
 * @param id - User ID
 * @returns A success message.
 */
export const deleteUser = async (id: number): Promise<void> => {
  const token = getTokenFromLocalStorage(); // Get the auth token from local storage
  try {
    await axios.post(
      `${API_URL}/users/${id}/delete`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the headers for authorization
        },
      }
    );
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};
