import axios from 'axios';

const API_URL = 'http://localhost:3000/api';


const api = axios.create({
    baseURL: API_URL,
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


// Auth APIs
export const login = (email, password) =>
    api.post('/auth/login', { email, password });


// Products APIs
export const getProducts = (params = {}) =>
    api.get('/products', { params });


export const getProduct = (id) =>
    api.get(`/products/${id}`);


// --- Cart APIs ---
// Get current user's cart
export const getCart = () => api.get("/cart");

// Add product to cart (or increase quantity)
export const addToCartApi = (productId, quantity = 1) =>
    api.post("/cart", { productId, quantity });

// Update quantity for a specific product in cart
export const updateCartItemApi = (productId, quantity) =>
    api.put(`/cart/${productId}`, { quantity });

// Remove a single product from cart
export const removeFromCartApi = (productId) =>
    api.delete(`/cart/${productId}`);

// Clear entire cart
export const clearCartApi = () => api.delete("/cart");

// --- Auth: profile ---
export const getProfile = () => api.get("/auth/profile");

export const updateProfile = (payload) => api.put("/auth/profile", payload);


export default api;