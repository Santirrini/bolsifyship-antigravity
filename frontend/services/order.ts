import { api } from './api';

export interface OrderItem {
    product_id: number;
    quantity: number;
}

export interface CreateOrderData {
    items: OrderItem[];
    shipping_address: string;
    payment_token: string;
}

export interface Order {
    id: number;
    user_id: number;
    total_amount: number;
    status: string;
    created_at: string;
    shipping_address: string;
}

export const orderService = {
    async createOrder(data: CreateOrderData): Promise<Order> {
        const response = await api.post('/orders/', data);
        return response.data;
    },

    async getMyOrders(): Promise<Order[]> {
        const response = await api.get('/orders/me');
        return response.data;
    },

    async getOrder(id: number): Promise<Order> {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    }
};
