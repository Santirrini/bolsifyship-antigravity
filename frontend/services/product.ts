import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const productService = {
    getProduct: async (id: number) => {
        const response = await axios.get(`${API_URL}/products/${id}`);
        return response.data;
    },

    // Helper to fetch multiple products
    getProductsByIds: async (ids: number[]) => {
        const promises = ids.map(id => axios.get(`${API_URL}/products/${id}`));
        const responses = await Promise.all(promises);
        return responses.map(r => r.data);
    }
};
