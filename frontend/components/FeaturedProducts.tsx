'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import Link from 'next/link';

export default function FeaturedProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState<'all' | 'offers' | 'new'>('all');

    useEffect(() => {
        fetch('http://localhost:8000/search')
            .then(res => res.json())
            .then(data => setProducts(data.slice(0, 12))) // Fetch more to allow filtering
            .catch(err => console.error(err));
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
                    <ProductCard key={idx} {...product} title={product.name} />
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
