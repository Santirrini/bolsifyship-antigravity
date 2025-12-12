'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import Link from 'next/link';

export default function FeaturedProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState<'all' | 'offers' | 'new'>('all');

    useEffect(() => {
        // Use local test data immediately for visual impact
        const testProducts = [
            {
                id: 101,
                name: "Smart Watch Elite",
                description: "Reloj inteligente con monitor de salud avanzado.",
                price: 299.99,
                discount_price: 249.99,
                image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop",
                rating: 4.8,
                reviews: 120,
                category: "Electronics"
            },
            {
                id: 102,
                name: "Audífonos Noise Cancel",
                description: "Sonido inmersivo con cancelación de ruido activa.",
                price: 199.99,
                discount_price: 159.99,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
                rating: 4.9,
                reviews: 85,
                category: "Audio"
            },
            {
                id: 103,
                name: "Cámara Pro X",
                description: "Captura momentos inolvidables en 4K.",
                price: 899.99,
                discount_price: null,
                image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
                rating: 4.7,
                reviews: 45,
                category: "Photography"
            },
            {
                id: 104,
                name: "Laptop Ultra Slim",
                description: "Potencia y portabilidad en un diseño elegante.",
                price: 1299.99,
                discount_price: 1199.99,
                image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop",
                rating: 4.9,
                reviews: 210,
                category: "Computers"
            },
            {
                id: 105,
                name: "Sneakers Urban Flow",
                description: "Comodidad y estilo para tu día a día.",
                price: 129.99,
                discount_price: 89.99,
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
                rating: 4.6,
                reviews: 150,
                category: "Fashion"
            },
            {
                id: 106,
                name: "Mochila Tech",
                description: "Espacio para todos tus gadgets.",
                price: 79.99,
                discount_price: null,
                image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
                rating: 4.5,
                reviews: 90,
                category: "Accessories"
            }
        ];

        setProducts(testProducts);

        // Also try to fetch from API, but prioritize test data for this demo if needed via a flag, 
        // or just append if you want both. For now, replacing with test data as requested.
        /*
        fetch('http://localhost:8000/search')
            .then(res => res.json())
            .then(data => {
                 if (data && data.length > 0) setProducts(data.slice(0, 12));
            })
            .catch(err => console.error(err));
        */
    }, []);

    const getFilteredProducts = () => {
        let filtered = [...products];

        switch (activeFilter) {
            case 'offers':
                filtered = filtered.filter(p => p.discount_price && p.discount_price < p.price);
                break;
            case 'new':
                // Assuming higher ID means newer product since we don't have created_at
                filtered = filtered.sort((a, b) => b.id - a.id);
                break;
            default:
                // 'all' - just show the default order
                break;
        }

        return filtered.slice(0, 4);
    };

    const filteredProducts = getFilteredProducts();

    return (
        <section className="py-12 px-4 max-w-7xl mx-auto bg-gray-50/50 dark:bg-neutral-900/50 rounded-3xl my-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Productos Destacados</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Selección exclusiva para esta temporada</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveFilter('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'all'
                            ? 'bg-black dark:bg-white text-white dark:text-black'
                            : 'bg-white dark:bg-neutral-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700'
                            }`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setActiveFilter('offers')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'offers'
                            ? 'bg-black dark:bg-white text-white dark:text-black'
                            : 'bg-white dark:bg-neutral-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700'
                            }`}
                    >
                        Ofertas
                    </button>
                    <button
                        onClick={() => setActiveFilter('new')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'new'
                            ? 'bg-black dark:bg-white text-white dark:text-black'
                            : 'bg-white dark:bg-neutral-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700'
                            }`}
                    >
                        Nuevos
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product, idx) => (
                    <ProductCard
                        key={idx}
                        product={{
                            id: product.id,
                            title: product.name,
                            description: product.description || '',
                            price: product.price,
                            discount_price: product.discount_price,
                            image: product.image,
                            rating: product.rating,
                            reviews_count: product.reviews,
                            store: 1, // Fallback
                            category: product.category
                        }}
                    />
                ))}
            </div>

            <div className="mt-12 text-center">
                <Link href="/search" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                    Ver Todos los Productos
                </Link>
            </div>
        </section>
    );
}
