import axios from 'axios';

// const API = axios.create({ baseURL: 'http://localhost:5003/api' });
const API = axios.create({ baseURL: 'https://handmade-art-gallery.onrender.com' });

// Add auth token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const googleLogin = (data) => API.post('/auth/google', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const resetPassword = (data) => API.post('/auth/reset-password', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Product endpoints (can be added later)
export const getProducts = () => API.get('/products');
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Order endpoints (can be added later)
export const getOrders = () => API.get('/orders');
export const createOrder = (data) => API.post('/orders', data);
export const updateOrder = (id, data) => API.put(`/orders/${id}`, data); 