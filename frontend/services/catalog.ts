import { api } from './api';

export interface Product {
    id: number;
    title: string;
    description: string;
    price: string;
    image: string;
    store: number;
}

export const catalogService = {
    async getProducts(): Promise<Product[]> {
        const response = await api.get<Product[]>('/products/');
        return response.data;
    },

    async getProduct(id: string): Promise<Product> {
        const response = await api.get<Product>(`/products/${id}/`);
        return response.data;
    }
};
