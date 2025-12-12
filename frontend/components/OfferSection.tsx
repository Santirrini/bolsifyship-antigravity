"use client";

import React, { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number | string;
    discount_price?: number | string;
    category: string;
    rating: number;
    reviews: number;
    image: string;
}

interface OfferSectionProps {
    title: string;
    subtitle?: string;
    endpoint: string;
}

const OfferSection: React.FC<OfferSectionProps> = ({ title, subtitle, endpoint }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`http://localhost:8000/offers/${endpoint}`);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error("Error fetching offers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [endpoint]);

    if (loading) {
        return <div className="p-8 text-center text-gray-400">Loading {title}...</div>;
    }

    if (products.length === 0) {
        return null; // Don't show empty sections
    }

    return (
        <section className="py-12 px-4 md:px-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
                {subtitle && <p className="text-gray-400">{subtitle}</p>}
            </div>

            <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
                {products.map((product) => (
                    <div key={product.id} className="min-w-[160px] md:min-w-[280px]">
                        <ProductCard
                            product={{
                                id: product.id,
                                title: product.name,
                                description: product.description,
                                price: product.price.toString(),
                                discount_price: product.discount_price?.toString(),
                                image: product.image,
                                rating: product.rating,
                                reviews_count: product.reviews,
                                store: 1, // Fallback
                                category: product.category
                            }}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default OfferSection;
