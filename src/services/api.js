import axios from 'axios';

// Determine the base URL based on the current environment
const getBaseURL = () => {
  // Use environment variable if available (for Vite)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check if we're in production (deployed on render)
  if (window.location.hostname === 'handmade-art-gallery.onrender.com' || 
      window.location.hostname === 'handmade-art-gallery-frontend.onrender.com' ||
      window.location.hostname === 'handmadeartgallery.vercel.app') {
    return 'https://handmade-art-gallery-backend.onrender.com/api';
  }
  // Development environment
  return 'http://localhost:5000/api';
};

const API = axios.create({ 
  baseURL: getBaseURL()
});

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
    // Only redirect on 401 if we're not already on auth pages
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/signin' || currentPath === '/signup' || currentPath === '/login';
      
      if (!isAuthPage) {
        // Token expired or invalid - clear storage but don't redirect immediately
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Only redirect if we're not already on an auth page
        if (!isAuthPage) {
          window.location.href = '/signin';
        }
      }
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

// Product endpoints
export const getProducts = () => API.get('/products');
export const getProductById = (id) => API.get(`/products/${id}`);
export const getSellerProducts = () => API.get('/products/seller');
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Order endpoints
export const getOrders = () => API.get('/orders');
export const getSellerOrders = () => API.get('/orders/seller');
export const createOrder = (data) => API.post('/orders', data);
export const updateOrder = (id, data) => API.put(`/orders/${id}`, data);
export const getOrderById = (id) => API.get(`/orders/${id}`);

// Cart endpoints
export const getCart = () => API.get('/cart');
export const addToCart = (data) => API.post('/cart/add', data);
export const updateCartItem = (id, data) => API.put(`/cart/${id}`, data);
export const removeFromCart = (id) => API.delete(`/cart/${id}`);
export const clearCart = () => API.delete('/cart'); 