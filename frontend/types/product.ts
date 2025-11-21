export interface Store {
    id: number;
    name: string;
    description?: string;
    logo_url?: string;
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    discount_price?: number;
    category: string;
    rating: number;
    reviews: number;
    source: string;
    image?: string;
    store_id?: number;
}

export interface ProductDetail extends Product {
    store?: Store;
}
