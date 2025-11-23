'use client';

import React from 'react';
import StoreCard from './StoreCard';
import { Store } from '@/services/store';
import { Loader2 } from 'lucide-react';

interface StoreGridProps {
    stores: Store[];
    isLoading: boolean;
    error: string | null;
}

const StoreGrid: React.FC<StoreGridProps> = ({ stores, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-destructive mb-2">Error al cargar tiendas</p>
                <p className="text-muted-foreground text-sm">{error}</p>
            </div>
        );
    }

    if (stores.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron tiendas que coincidan con tu búsqueda.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
                <StoreCard key={store.id} store={store} />
            ))}
        </div>
    );
};

export default StoreGrid;
