import api from './api';

export const adminService = {
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },
    getProducts: async (skip = 0, limit = 100) => {
        const response = await api.get(`/admin/products?skip=${skip}&limit=${limit}`);
        return response.data;
    },
    createProduct: async (productData: any) => {
        const response = await api.post('/admin/products', productData);
        return response.data;
    },
    updateProduct: async (productId: number, productData: any) => {
        const response = await api.put(`/admin/products/${productId}`, productData);
        return response.data;
    },
    deleteProduct: async (productId: number) => {
        const response = await api.delete(`/admin/products/${productId}`);
        return response.data;
    },
    getOrders: async (skip = 0, limit = 100) => {
        const response = await api.get(`/admin/orders?skip=${skip}&limit=${limit}`);
        return response.data;
    },
    updateOrderStatus: async (orderId: number, status: string) => {
        const response = await api.put(`/admin/orders/${orderId}`, { status });
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

        const response = await api.get(`/admin/users?${params.toString()}`);
        return response.data;
    },
    updateUser: async (userId: number, userData: any) => {
        const response = await api.put(`/admin/users/${userId}`, userData);
        return response.data;
    },
    createUser: async (userData: any) => {
        const response = await api.post('/admin/users', userData);
        return response.data;
    },
    deleteUser: async (userId: number) => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    }
};
