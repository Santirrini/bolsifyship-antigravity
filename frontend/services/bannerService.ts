import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface Banner {
    id: number;
    title: string;
    subtitle?: string;
    highlight_text?: string;
    description?: string;
    image_url: string;
    link_url?: string;
    position: string;
    is_active: number;
    order: number;
}

export interface BannerCreate {
    title: string;
    subtitle?: string;
    highlight_text?: string;
    description?: string;
    image_url: string;
    link_url?: string;
    position: string;
    is_active: number;
    order: number;
}

export interface BannerUpdate {
    title?: string;
    subtitle?: string;
    highlight_text?: string;
    description?: string;
    image_url?: string;
    link_url?: string;
    position?: string;
    is_active?: number;
    order?: number;
}

export const bannerService = {
    getAll: async (position?: string, activeOnly?: boolean) => {
        const params = new URLSearchParams();
        if (position) params.append('position', position);
        if (activeOnly) params.append('active_only', 'true');

        const response = await axios.get<Banner[]>(`${API_URL}/banners`, { params });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await axios.get<Banner>(`${API_URL}/banners/${id}`);
        return response.data;
    },

    create: async (banner: BannerCreate) => {
        const response = await axios.post<Banner>(`${API_URL}/banners`, banner);
        return response.data;
    },

    update: async (id: number, banner: BannerUpdate) => {
        const response = await axios.put<Banner>(`${API_URL}/banners/${id}`, banner);
        return response.data;
    },

    delete: async (id: number) => {
        await axios.delete(`${API_URL}/banners/${id}`);
    }
};
