import api from './api';

export const userService = {
    getProfile: async () => {
        const response = await api.get('/auth/users/me');
        return response.data;
    },
    updateProfile: async (userData: any) => {
        const response = await api.put('/users/me', userData);
        return response.data;
    },
    getAddresses: async () => {
        const response = await api.get('/users/me/addresses');
        return response.data;
    },
    createAddress: async (addressData: any) => {
        const response = await api.post('/users/me/addresses', addressData);
        return response.data;
    },
    updateAddress: async (addressId: number, addressData: any) => {
        const response = await api.put(`/users/me/addresses/${addressId}`, addressData);
        return response.data;
    },
    deleteAddress: async (addressId: number) => {
        const response = await api.delete(`/users/me/addresses/${addressId}`);
        return response.data;
    },
    getPaymentMethods: async () => {
        const response = await api.get('/users/me/payment-methods');
        return response.data;
    },
    createPaymentMethod: async (paymentData: any) => {
        const response = await api.post('/users/me/payment-methods', paymentData);
        return response.data;
    },
    deletePaymentMethod: async (paymentId: number) => {
        const response = await api.delete(`/users/me/payment-methods/${paymentId}`);
        return response.data;
    },
    getOrders: async () => {
        const response = await api.get('/orders/me');
        return response.data;
    },
    getWishlist: async (userId: number) => {
        const response = await api.get(`/wishlist/${userId}`);
        return response.data;
    },
    toggleWishlist: async (userId: number, productId: number) => {
        const response = await api.post('/wishlist/toggle', { user_id: userId, product_id: productId });
        return response.data;
    }
};
