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
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
            <Navbar />

            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 pt-24 pb-8 md:pt-32 md:pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                            Nuestros Proveedores Verificados
                        </h1>
                        <p className="text-gray-500 text-lg">
                            Explora el "Hall de la Fama" de proveedores asiáticos verificados. Calidad, confianza y transparencia.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative mb-8">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                            placeholder="Buscar tienda por nombre..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Category Pills */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <StoreGrid stores={stores} isLoading={isLoading} error={error} />
            </main>

            <BottomNav />
        </div>
    );
}
