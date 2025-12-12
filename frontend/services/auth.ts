import { api } from './api';

export interface LoginResponse {
    key: string;
}

export interface User {
    pk: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export const authService = {
    async login(data: FormData): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/auth/login/', data);
        return response.data;
    },

    async register(data: any): Promise<any> {
        const response = await api.post('/auth/registration/', data);
        return response.data;
    },

    async logout(): Promise<void> {
        await api.post('/auth/logout/');
    },

    async getUser(): Promise<User> {
        const response = await api.get<User>('/auth/user/');
        return response.data;
    }
};
