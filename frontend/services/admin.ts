import axios from 'axios';

const API_URL = 'http://localhost:8000/admin';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const adminService = {
    getStats: async () => {
        const response = await axios.get(`${API_URL}/stats`, getAuthHeader());
        return response.data;
    },
    getProducts: async (skip = 0, limit = 100) => {
        const response = await axios.get(`${API_URL}/products?skip=${skip}&limit=${limit}`, getAuthHeader());
        return response.data;
    },
    createProduct: async (productData: any) => {
        const response = await axios.post(`${API_URL}/products`, productData, getAuthHeader());
        return response.data;
    },
    updateProduct: async (productId: number, productData: any) => {
        const response = await axios.put(`${API_URL}/products/${productId}`, productData, getAuthHeader());
        return response.data;
    },
    deleteProduct: async (productId: number) => {
        const response = await axios.delete(`${API_URL}/products/${productId}`, getAuthHeader());
        return response.data;
    },
    getOrders: async (skip = 0, limit = 100) => {
        const response = await axios.get(`${API_URL}/orders?skip=${skip}&limit=${limit}`, getAuthHeader());
        return response.data;
    },
    updateOrderStatus: async (orderId: number, status: string) => {
        const response = await axios.put(`${API_URL}/orders/${orderId}`, { status }, getAuthHeader());
        return response.data;
    },
    getUsers: async (
        skip = 0,
        limit = 10,
        search = "",
        role: number | null = null,
        status: number | null = null,
        sortBy = "id",
        sortOrder = "asc"
    ) => {
        const params = new URLSearchParams();
        params.append("skip", skip.toString());
        params.append("limit", limit.toString());
        if (search) params.append("search", search);
        if (role !== null) params.append("role", role.toString());
        if (status !== null) params.append("is_active", status.toString());
        params.append("sort_by", sortBy);
        params.append("sort_order", sortOrder);

        const response = await axios.get(`${API_URL}/users?${params.toString()}`, getAuthHeader());
        return response.data;
    },
    updateUser: async (userId: number, userData: any) => {
        const response = await axios.put(`${API_URL}/users/${userId}`, userData, getAuthHeader());
        return response.data;
    },
    createUser: async (userData: any) => {
        const response = await axios.post(`${API_URL}/users`, userData, getAuthHeader());
        return response.data;
    },
    deleteUser: async (userId: number) => {
        const response = await axios.delete(`${API_URL}/users/${userId}`, getAuthHeader());
        return response.data;
    }
};
