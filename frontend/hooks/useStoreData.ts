import { useState, useEffect, useCallback } from 'react';
import { storeService, Store } from '@/services/store';

interface UseStoreDataReturn {
    store: Store | null;
    products: any[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useStoreData = (storeId: string | undefined): UseStoreDataReturn => {
    const [store, setStore] = useState<Store | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!storeId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const id = parseInt(storeId);
            if (isNaN(id)) {
                throw new Error("Invalid store ID");
            }

            const [storeData, productsData] = await Promise.all([
                storeService.getStore(id),
                storeService.getStoreProducts(id)
            ]);

            setStore(storeData);
            setProducts(productsData);
        } catch (err: any) {
            console.error('Error fetching store data:', err);
            setError(err.message || 'Failed to load store data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [storeId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { store, products, loading, error, refetch: fetchData };
};
