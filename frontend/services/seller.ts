import api from './api';

export interface SellerOnboardData {
    user: {
        email: string;
        password: string;
        full_name: string;
    };
    store: {
        name: string;
        description: string;
    };
}

export interface SellerOnboardResponse {
    access_token: string;
    token_type: string;
    user: {
        id: number;
        email: string;
        full_name: string;
        role: string;
    };
    store: {
        id: number;
        name: string;
        description: string;
    };
}

export const sellerService = {
    onboardSeller: async (data: SellerOnboardData): Promise<SellerOnboardResponse> => {
        try {
            const response = await api.post<SellerOnboardResponse>('/seller/onboard', data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Error al registrar la tienda');
        }
    },

    registerStore: async (data: { name: string; description: string; logo_url?: string }) => {
        try {
            const response = await api.post('/seller/register', data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Error al crear la tienda');
        }
    }
};
