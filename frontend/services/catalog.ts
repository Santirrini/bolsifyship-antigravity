import { api } from './api';

export interface Product {
    id: number;
    title: string;
    name?: string; // Backend sometimes returns name, frontend aliases to title
    description: string;
    price: string;
    discount_price?: string | null;
    image: string;
    store: number;
    rating?: number;
    reviews_count?: number;
    category?: string;
    season?: string;
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
