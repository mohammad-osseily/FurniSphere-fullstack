// app/services/api.ts
import axios, { AxiosInstance, AxiosStatic } from 'axios';
import { logoutUser } from './authServices';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isHandlingUnauthorized = false;

const handleUnauthorized = () => {
  if (isHandlingUnauthorized) return;
  isHandlingUnauthorized = true;
  logoutUser();
  alert('Session expired. Please log in again.');
  window.location.href = '/login';
};

const attachResponseInterceptor = (client: AxiosInstance | AxiosStatic) => {
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      if (status === 401 || status === 419) {
        handleUnauthorized();
      }
      return Promise.reject(error);
    }
  );
};

attachResponseInterceptor(API);
attachResponseInterceptor(axios);

export default API;
