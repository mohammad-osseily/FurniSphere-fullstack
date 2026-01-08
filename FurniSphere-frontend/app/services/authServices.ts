// app/services/authServices.ts
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api"; // Your API base URL

// Save token to local storage
export const saveTokenToLocalStorage = (token: string) => {
  localStorage.setItem("token", token);
};

// Save user to local storage
export const saveUserToLocalStorage = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Get token from local storage
export const getTokenFromLocalStorage = () => {
  return localStorage.getItem("token");
};

// Get user from local storage
export const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Remove token and user from local storage
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Login function
export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  const { token } = response.data.authorization;
  const { user } = response.data;

  saveTokenToLocalStorage(token);
  saveUserToLocalStorage(user);

  return user;
};

// Register function
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  password_confirmation: string
) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    name,
    email,
    password,
    password_confirmation,
  });
  const { token } = response.data.authorization;
  const { user } = response.data;

  saveTokenToLocalStorage(token);
  saveUserToLocalStorage(user);

  return user;
};

// Logout function
export const logout = async () => {
  const token = getTokenFromLocalStorage();
  await axios.post(
    `${API_URL}/auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  logoutUser();
};

// Refresh token function
export const refreshToken = async () => {
  const token = getTokenFromLocalStorage();
  const response = await axios.post(
    `${API_URL}/auth/refresh`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const newToken = response.data.authorization.token;
  saveTokenToLocalStorage(newToken);
  return newToken;
};
export const updateProfile = async (
  name: string,
  email: string,
  password?: string,
  password_confirmation?: string
) => {
  const token = getTokenFromLocalStorage();

  // Create a payload object with only the fields that need updating
  const payload: Record<string, string> = { name, email };

  // Add password and password_confirmation only if they are provided
  if (password && password_confirmation) {
    payload.password = password;
    payload.password_confirmation = password_confirmation;
  }

  const response = await axios.post(
    `${API_URL}/user/profile/update`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
