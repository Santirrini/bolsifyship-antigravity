'use client';

import { useRouter, useSearchParams, useParams } from 'next/navigation';
import StoreHero from '@/components/store/StoreHero';
import StoreTabs from '@/components/store/StoreTabs';
import { ProductCard } from '@/components/ProductCard'; // Corrected import
import Breadcrumbs from '@/components/ui/Breadcrumbs';
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

            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
                <Breadcrumbs
                    items={[
                        { label: 'Tiendas', href: '/stores' },
                        { label: store.name, href: `/store/${id}` }
                    ]}
                />
            </div>

            <StoreTabs activeTab={activeTab} onTabChange={handleTabChange} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {activeTab === 'home' && (
                    <div className="space-y-12">
                        {/* New Arrivals Section */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">New Arrivals</h2>
                                <button
                                    onClick={() => handleTabChange('products')}
                                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                                >
                                    View All
                                </button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                                {products.slice(0, 4).map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={{
                                            id: product.id,
                                            title: product.name,
                                            description: product.description || '',
                                            price: product.price as any,
                                            discount_price: product.discount_price as any,
                                            image: product.image,
                                            rating: product.rating,
                                            reviews_count: product.reviews || 0,
                                            store: store.id,
                                            category: product.season
                                        }}
                                    />
                                ))}
                                {products.length === 0 && (
                                    <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-dashed border-gray-200 dark:border-neutral-800">
                                        No new arrivals yet.
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Featured Products Section */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Products</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                                {products.slice(0, 8).map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={{
                                            id: product.id,
                                            title: product.name,
                                            description: product.description || '',
                                            price: product.price as any,
                                            discount_price: product.discount_price as any,
                                            image: product.image,
                                            rating: product.rating,
                                            reviews_count: product.reviews || 0,
                                            store: store.id,
                                            category: product.season
                                        }}
                                    />
                                ))}
                                {products.length === 0 && (
                                    <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-dashed border-gray-200 dark:border-neutral-800">
                                        No featured products available.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Products</h2>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">{products.length} products</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={{
                                        id: product.id,
                                        title: product.name,
                                        description: product.description || '',
                                        price: product.price as any,
                                        discount_price: product.discount_price as any,
                                        image: product.image,
                                        rating: product.rating,
                                        reviews_count: product.reviews || 0,
                                        store: store.id,
                                        category: product.season
                                    }}
                                />
                            ))}
                        </div>
                        {products.length === 0 && (
                            <div className="text-center py-20 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-dashed border-gray-200 dark:border-neutral-800">
                                <p className="text-lg font-medium mb-2">No products found</p>
                                <p className="text-sm">This store hasn't added any products yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-neutral-800 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About {store.name}</h2>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                    {store.description || "This store hasn't added a description yet."}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800">
                                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">📞</span>
                                    Contact Information
                                </h3>
                                <div className="space-y-3 text-gray-600 dark:text-gray-400">
                                    {store.contact_email && (
                                        <p className="flex items-center gap-3">
                                            <span className="font-medium text-gray-900 dark:text-white w-16">Email:</span>
                                            {store.contact_email}
                                        </p>
                                    )}
                                    {store.phone && (
                                        <p className="flex items-center gap-3">
                                            <span className="font-medium text-gray-900 dark:text-white w-16">Phone:</span>
                                            {store.phone}
                                        </p>
                                    )}
                                    {store.address && (
                                        <p className="flex items-center gap-3">
                                            <span className="font-medium text-gray-900 dark:text-white w-16">Address:</span>
                                            {store.address}
                                        </p>
                                    )}
                                    {!store.contact_email && !store.phone && !store.address && (
                                        <p className="text-gray-500 italic">No contact information provided.</p>
                                    )}
                                </div>
                            </div>
                            <div className="p-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800">
                                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">🚚</span>
                                    Store Policies
                                </h3>
                                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                                    {store.shipping_policy && (
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Shipping Policy</h4>
                                            <p className="text-sm">{store.shipping_policy}</p>
                                        </div>
                                    )}
                                    {store.return_policy && (
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Return Policy</h4>
                                            <p className="text-sm">{store.return_policy}</p>
                                        </div>
                                    )}
                                    {!store.shipping_policy && !store.return_policy && (
                                        <p className="text-gray-500 italic">No policies provided.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="max-w-3xl mx-auto text-center py-20">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-yellow-50 dark:bg-yellow-900/20 mb-6">
                            <span className="text-4xl">⭐</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Reviews coming soon</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
                            We are working on bringing you verified reviews from real customers. Stay tuned!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
