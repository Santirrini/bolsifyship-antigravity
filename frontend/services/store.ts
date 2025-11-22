import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Store {
    id: number;
    name: string;
    description?: string;
    logo_url?: string;
    banner_url?: string;
    category?: string;
    rating?: number;
    response_rate?: number;
    owner_id: number;
    created_at?: string;
}

// Mock data for development/fallback
export const MOCK_STORE: Store = {
    id: 2,
    name: "Fashion Hub",
    description: "Your one-stop shop for the latest trends in fashion. We offer high-quality clothing at affordable prices.",
    logo_url: "https://ui-avatars.com/api/?name=Fashion+Hub&background=0D8ABC&color=fff",
    banner_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    category: "Moda",
    rating: 4.8,
    response_rate: 98,
    owner_id: 1,
    created_at: "2024-01-01T00:00:00Z"
};

export const MOCK_PRODUCTS = [
    {
        id: 101,
        name: "Classic White T-Shirt",
        price: 29.99,
        discount_price: null,
        rating: 4.5,
        reviews: 128,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        season: "Summer",
        store_id: 2
    },
    {
        id: 102,
        name: "Denim Jacket",
        price: 89.99,
        discount_price: 79.99,
        rating: 4.8,
        reviews: 85,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        season: "Winter",
        store_id: 2
    },
    {
        id: 103,
        name: "Summer Dress",
        price: 59.99,
        discount_price: null,
        rating: 4.2,
        reviews: 45,
        image: "https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        season: "Summer",
        store_id: 2
    },
    {
        id: 104,
        name: "Leather Boots",
        price: 129.99,
        discount_price: null,
        rating: 4.9,
        reviews: 210,
        image: "https://images.unsplash.com/photo-1520639888713-78db11c0dd26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        season: "Winter",
        store_id: 2
    }
];

export const storeService = {
    getAllStores: async (params: { skip?: number; limit?: number; category?: string; search?: string } = {}) => {
        try {
            const response = await axios.get(`${API_URL}/stores/`, { params });
            return response.data;
        } catch (error) {
            console.warn("Failed to fetch stores, returning mock data", error);
            return [MOCK_STORE];
        }
    },

    getStore: async (id: number) => {
        try {
            const response = await axios.get(`${API_URL}/stores/${id}`);
            return response.data;
        } catch (error) {
            console.warn(`Failed to fetch store ${id}, using mock data if ID matches 2`, error);
            // Fallback to mock data for demonstration if the API fails or for specific ID
            if (id === 2) return MOCK_STORE;
            throw error;
        }
    },

    getStoreProducts: async (id: number) => {
        try {
            const response = await axios.get(`${API_URL}/stores/${id}/products`);
            return response.data;
        } catch (error) {
            console.warn(`Failed to fetch products for store ${id}, using mock data if ID matches 2`, error);
            if (id === 2) return MOCK_PRODUCTS;
            throw error;
        }
    }
};
