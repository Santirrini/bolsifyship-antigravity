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
}
