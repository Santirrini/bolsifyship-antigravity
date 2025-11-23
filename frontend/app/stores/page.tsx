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
        <div className="min-h-screen bg-background pb-20 md:pb-0">
            <Navbar />

            {/* Header Section */}
            <div className="bg-gradient-to-b from-background to-muted/30 border-b border-border/50 pt-24 pb-12 md:pt-32 md:pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
                            Nuestros Proveedores Verificados
                        </h1>
                        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                            Explora el "Hall de la Fama" de proveedores asiáticos verificados. Calidad, confianza y transparencia.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative mb-10">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-12 pr-4 py-4 bg-background border border-input rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm hover:shadow-md"
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
                                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                                    : 'bg-card text-muted-foreground border border-border hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/10'
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

            <div className="md:hidden">
                <BottomNav />
            </div>
        </div>
    );
}
