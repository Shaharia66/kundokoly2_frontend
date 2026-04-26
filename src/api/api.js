import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

// Attach JWT token to every request if present
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────
export const login = (username, password) =>
  axios.post(`${BASE_URL}/auth/login`, { username, password });

// ── Products ──────────────────────────────────────
export const getProducts = (params) =>
  axios.get(`${BASE_URL}/products`, { params });

export const getProductById = (id) =>
  axios.get(`${BASE_URL}/products/${id}`);

export const createProduct = (formData) =>
  axios.post(`${BASE_URL}/products`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateProduct = (id, formData) =>
  axios.put(`${BASE_URL}/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteProduct = (id) =>
  axios.delete(`${BASE_URL}/products/${id}`);

// ── Orders ────────────────────────────────────────
export const placeOrder = (orderData) =>
  axios.post(`${BASE_URL}/orders`, orderData);

export const getAllOrders = () =>
  axios.get(`${BASE_URL}/orders`);

export const updateOrderStatus = (id, status) =>
  axios.put(`${BASE_URL}/orders/${id}/status`, null, { params: { status } });

// ── Reviews ───────────────────────────────────────
export const getReviews = (productId) =>
  axios.get(`${BASE_URL}/reviews/product/${productId}`);

export const addReview = (review, productId) =>
  axios.post(`${BASE_URL}/reviews`, review, { params: { productId } });
