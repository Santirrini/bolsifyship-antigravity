'use client';

import { useRouter, useSearchParams, useParams } from 'next/navigation';
import StoreHero from '@/components/store/StoreHero';
import StoreTabs from '@/components/store/StoreTabs';
import ProductCard from '@/components/ProductCard';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useStoreData } from '@/hooks/useStoreData';

export default function StorePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const id = params?.id as string;
    const activeTab = searchParams.get('tab') || 'home';

    const { store, products, loading, error, refetch } = useStoreData(id);

    const handleTabChange = (tab: string) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('tab', tab);
        router.push(`?${newParams.toString()}`, { scroll: false });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                    <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading store...</p>
                </div>
            </div>
        );
    }

    if (error || !store) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black p-4">
                <div className="text-center max-w-md">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {error || "Store not found"}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        {error ? "We couldn't load the store information. Please check your connection and try again." : "The store you are looking for does not exist or has been removed."}
                    </p>
                    <button
                        onClick={refetch}
                        className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black pb-20">
            <StoreHero store={store} />
            <StoreTabs activeTab={activeTab} onTabChange={handleTabChange} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {activeTab === 'home' && (
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Featured Products</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {products.slice(0, 4).map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        title={product.name}
                                        price={product.price}
                                        oldPrice={product.discount_price}
                                        rating={product.rating || 0}
                                        reviews={product.reviews || 0}
                                        image={product.image}
                                        tag={product.season}
                                    />
                                ))}
                                {products.length === 0 && (
                                    <div className="col-span-full text-center py-12 text-gray-500">
                                        No featured products available.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    title={product.name}
                                    price={product.price}
                                    oldPrice={product.discount_price}
                                    rating={product.rating || 0}
                                    reviews={product.reviews || 0}
                                    image={product.image}
                                    tag={product.season}
                                />
                            ))}
                        </div>
                        {products.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No products found in this store.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="max-w-3xl">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About {store.name}</h2>
                        <div className="prose dark:prose-invert">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {store.description || "This store hasn't added a description yet."}
                            </p>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-gray-50 dark:bg-neutral-900 rounded-xl">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contact Information</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Email: contact@{store.name.toLowerCase().replace(/\s+/g, '')}.com<br />
                                    Phone: +1 (555) 123-4567
                                </p>
                            </div>
                            <div className="p-6 bg-gray-50 dark:bg-neutral-900 rounded-xl">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Shipping Policy</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Standard shipping: 10-15 business days.<br />
                                    Express shipping available.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-neutral-800 mb-4">
                            <span className="text-2xl">⭐</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Reviews coming soon</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            We are working on bringing you verified reviews from real customers.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
