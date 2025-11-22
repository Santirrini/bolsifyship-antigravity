
import axios from 'axios';

const API_URL = 'http://localhost:8000/banners';

export interface Banner {
    id: number;
    title: string;
    subtitle?: string;
    highlight_text?: string;
    description?: string;
    image_url: string;
    image_mobile?: string;
    link_url?: string;
    action_type: "url" | "category" | "product";
    action_value?: string;
    start_date?: string;
    end_date?: string;
    position: string;
    is_active: number;
    order: number;
    views: number;
    clicks: number;
}

export interface BannerCreate {
    title: string;
    subtitle?: string;
    highlight_text?: string;
    description?: string;
    image_url: string;
    image_mobile?: string;
    link_url?: string;
    action_type: "url" | "category" | "product";
    action_value?: string;
    start_date?: string;
    end_date?: string;
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
    image_mobile?: string;
    link_url?: string;
    action_type?: "url" | "category" | "product";
    action_value?: string;
    start_date?: string;
    end_date?: string;
    position?: string;
    is_active?: number;
    order?: number;
}

export const bannerService = {
    getAll: async (position?: string, activeOnly: boolean = false): Promise<Banner[]> => {
        const url = new URL(API_URL);
        if (position) url.searchParams.append("position", position);
        if (activeOnly) url.searchParams.append("active_only", "true");

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Failed to fetch banners");
        return response.json();
    },

    getById: async (id: number): Promise<Banner> => {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Failed to fetch banner");
        return response.json();
    },

    create: async (banner: BannerCreate): Promise<Banner> => {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(banner),
        });
        if (!response.ok) throw new Error("Failed to create banner");
        return response.json();
    },

    update: async (id: number, banner: BannerUpdate): Promise<Banner> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(banner),
        });
        if (!response.ok) throw new Error("Failed to update banner");
        return response.json();
    },

    delete: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete banner");
    },

    trackView: async (id: number): Promise<void> => {
        await fetch(`${API_URL}/${id}/view`, { method: "POST" });
    },

    trackClick: async (id: number): Promise<void> => {
        await fetch(`${API_URL}/${id}/click`, { method: "POST" });
    }
};
