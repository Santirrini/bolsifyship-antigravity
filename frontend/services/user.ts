import axios from 'axios';

const API_URL = 'http://localhost:8000';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const userService = {
    getProfile: async () => {
        const config = getAuthHeader();
        if (!config) return null;
        const response = await axios.get(`${API_URL}/auth/users/me`, config);
        return response.data;
    },
    updateProfile: async (userData: any) => {
        const config = getAuthHeader();
        if (!config) throw new Error("No token found");
        const response = await axios.put(`${API_URL}/users/me`, userData, config);
        return response.data;
    },
    getAddresses: async () => {
        const config = getAuthHeader();
        if (!config) throw new Error("No token found");
        const response = await axios.get(`${API_URL}/users/me/addresses`, config);
        return response.data;
    },
    createAddress: async (addressData: any) => {
        const config = getAuthHeader();
        if (!config) throw new Error("No token found");
        const response = await axios.post(`${API_URL}/users/me/addresses`, addressData, config);
        return response.data;
    },
    updateAddress: async (addressId: number, addressData: any) => {
        const config = getAuthHeader();
        if (!config) throw new Error("No token found");
        const response = await axios.put(`${API_URL}/users/me/addresses/${addressId}`, addressData, config);
        return response.data;
    },
    deleteAddress: async (addressId: number) => {
        const config = getAuthHeader();
        if (!config) throw new Error("No token found");
        const response = await axios.delete(`${API_URL}/users/me/addresses/${addressId}`, config);
        return response.data;
    },
    getPaymentMethods: async () => {
        const config = getAuthHeader();
        if (!config) throw new Error("No token found");
        const response = await axios.get(`${API_URL}/users/me/payment-methods`, config);
        return response.data;
    },
    createPaymentMethod: async (paymentData: any) => {
        const config = getAuthHeader();
        if (!config) throw new Error("No token found");
        const response = await axios.post(`${API_URL}/users/me/payment-methods`, paymentData, config);
        return response.data;
    },
    deletePaymentMethod: async (paymentId: number) => {
        const config = getAuthHeader();
        if (!config) throw new Error("No token found");
        const response = await axios.delete(`${API_URL}/users/me/payment-methods/${paymentId}`, config);
        return response.data;
    },
    getOrders: async () => {
        const config = getAuthHeader();
        if (!config) throw new Error("No token found");
        const response = await axios.get(`${API_URL}/orders/me`, config);
        return response.data;
    },
    getWishlist: async (userId: number) => {
        const config = getAuthHeader();
        if (!config) throw new Error("No token found");
        const response = await axios.get(`${API_URL}/wishlist/${userId}`, config);
        return response.data;
    },
    toggleWishlist: async (userId: number, productId: number) => {
        const config = getAuthHeader();
        if (!config) throw new Error("No token found");
        const response = await axios.post(`${API_URL}/wishlist/toggle`, { user_id: userId, product_id: productId }, config);
        return response.data;
    }
};
