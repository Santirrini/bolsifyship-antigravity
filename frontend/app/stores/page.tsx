'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import StoreGrid from '@/components/store/StoreGrid';
import { storeService, Store } from '@/services/store';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

const CATEGORIES = ["Todos", "Tecnología", "Moda", "Hogar", "Belleza", "Juguetes"];

export default function StoreExplorerPage() {
    const [stores, setStores] = useState<Store[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    useEffect(() => {
        const fetchStores = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const params: any = {};
                if (searchQuery) params.search = searchQuery;
                if (selectedCategory !== 'Todos') params.category = selectedCategory;

                const data = await storeService.getAllStores(params);
                setStores(data);
            } catch (err) {
                setError('No se pudieron cargar las tiendas. Por favor intenta de nuevo.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchStores();
        }, 300); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [searchQuery, selectedCategory]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 transition-colors duration-300 pb-20 md:pb-0">
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 pt-32 pb-20 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#171717_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide uppercase mb-6 border border-blue-100 dark:border-blue-800">
                        Directorio Oficial
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                        Proveedores <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Verificados</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
                        Accede al "Hall de la Fama" del comercio asiático. Conectamos tu negocio con fabricantes de confianza, calidad garantizada y transparencia total.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                            placeholder="Buscar tienda por nombre o categoría..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Filters & Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Category Pills */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border ${selectedCategory === category
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-transparent shadow-lg scale-105'
                                : 'bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <StoreGrid stores={stores} isLoading={isLoading} error={error} />
            </div>

            <div className="md:hidden">
                <BottomNav />
            </div>
        </div>
    );
}
