'use client';

import { useState, useEffect, Suspense } from 'react';
import { Search, ArrowLeft, Filter, X, Star, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { ProductCard } from '@/components/ProductCard'; // Corrected import
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Product } from '@/types/product';
import { useAuth } from '@/context/AuthContext';

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [query, setQuery] = useState(searchParams.get('query') || '');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const { user } = useAuth();
    const [wishlistIds, setWishlistIds] = useState<number[]>([]);

    // Filters
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
    const [minRating, setMinRating] = useState(searchParams.get('min_rating') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || '');
    const [onSale, setOnSale] = useState(searchParams.get('on_sale') === 'true');

    useEffect(() => {
        fetchProducts();
    }, [searchParams]);

    useEffect(() => {
        if (user) {
            fetchWishlist();
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            const res = await fetch(`http://localhost:8000/wishlist/${user!.id}`);
            if (res.ok) {
                const data = await res.json();
                setWishlistIds(data.map((item: any) => item.product_id));
            }
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (query) params.append('query', query);
            if (category) params.append('category', category);
            if (minPrice) params.append('min_price', minPrice);
            if (maxPrice) params.append('max_price', maxPrice);
            if (minRating) params.append('min_rating', minRating);
            if (sortBy) params.append('sort_by', sortBy);
            if (onSale) params.append('on_sale', 'true');

            const res = await fetch(`http://localhost:8000/search?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setResults(data);
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (query) params.set('query', query);
        if (category) params.set('category', category);
        if (minPrice) params.set('min_price', minPrice);
        if (maxPrice) params.set('max_price', maxPrice);
        if (minRating) params.set('min_rating', minRating);
        if (sortBy) params.set('sort_by', sortBy);
        if (onSale) params.set('on_sale', 'true');

        router.push(`/search?${params.toString()}`);
        setShowMobileFilters(false);
    };

    const clearFilters = () => {
        setCategory('');
        setMinPrice('');
        setMaxPrice('');
        setMinRating('');
        setSortBy('');
        setOnSale(false);
        setQuery('');
        router.push('/search');
    };

    const categories = ["Electrónica", "Hogar", "Moda", "Deportes", "Juguetes", "Libros", "Belleza", "Herramientas"];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex flex-col transition-colors duration-300">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold mb-4">Filtros</h3>

                            {/* Categories */}
                            <div className="mb-6">
                                <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Categorías</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <button
                                            onClick={() => { setCategory(''); applyFilters(); }}
                                            className={`text-sm ${!category ? 'text-blue-600 font-bold bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg w-full text-left' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-1'}`}
                                        >
                                            Todas las Categorías
                                        </button>
                                    </li>
                                    {categories.map(cat => (
                                        <li key={cat}>
                                            <button
                                                onClick={() => { setCategory(cat); applyFilters(); }}
                                                className={`text-sm w-full text-left px-3 py-1 rounded-lg ${category === cat ? 'text-blue-600 font-bold bg-blue-50 dark:bg-blue-900/30' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
                                            >
                                                {cat}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Rango de Precio</h4>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full p-2 border rounded-lg text-sm bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full p-2 border rounded-lg text-sm bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <button onClick={applyFilters} className="text-sm text-blue-600 font-medium hover:underline">Aplicar</button>
                            </div>

                            {/* Rating */}
                            <div className="mb-6">
                                <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Calificación</h4>
                                <div className="space-y-2">
                                    {[4, 3, 2, 1].map((star) => (
                                        <label key={star} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="rating_desktop"
                                                checked={minRating === star.toString()}
                                                onChange={() => {
                                                    setMinRating(star.toString());
                                                    const params = new URLSearchParams();
                                                    if (query) params.set('query', query);
                                                    if (category) params.set('category', category);
                                                    if (minPrice) params.set('min_price', minPrice);
                                                    if (maxPrice) params.set('max_price', maxPrice);
                                                    params.set('min_rating', star.toString());
                                                    if (sortBy) params.set('sort_by', sortBy);
                                                    if (onSale) params.set('on_sale', 'true');
                                                    router.push(`/search?${params.toString()}`);
                                                }}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">& más</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* On Sale */}
                            <div className="mb-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={onSale}
                                        onChange={(e) => { setOnSale(e.target.checked); applyFilters(); }}
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Solo Ofertas</span>
                                </label>
                            </div>

                            <button onClick={clearFilters} className="w-full py-2 text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-neutral-700 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800">
                                Limpiar Filtros
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Header: Results Count & Sort */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Mostrando {results.length} resultados</p>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Recomendados para Ti</h2>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <button
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                                    onClick={() => setShowMobileFilters(true)}
                                >
                                    <Filter className="w-4 h-4" /> Filtros
                                </button>

                                <div className="relative ml-auto sm:ml-0">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => { setSortBy(e.target.value); applyFilters(); }}
                                        className="appearance-none bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-200 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    >
                                        <option value="">Ordenar Por: Relevancia</option>
                                        <option value="price_asc">Precio: Menor a Mayor</option>
                                        <option value="price_desc">Precio: Mayor a Menor</option>
                                        <option value="rating_desc">Mejor Calificados</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {results.map((item) => (
                                    <ProductCard
                                        key={item.id}
                                        product={{
                                            id: item.id,
                                            title: item.name,
                                            description: item.description || '',
                                            price: item.price.toString(), // Ensure string
                                            discount_price: item.discount_price ? item.discount_price.toString() : undefined,
                                            image: item.image || '',
                                            rating: item.rating,
                                            reviews_count: item.reviews, // Assume item.reviews is count
                                            store: item.store_id || 1, // Fallback
                                            category: item.category
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {results.length === 0 && !loading && (
                            <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-gray-200 dark:border-neutral-800">
                                <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No se encontraron productos</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">Intenta ajustar tus filtros o búsqueda.</p>
                                <button onClick={clearFilters} className="text-blue-600 font-bold hover:underline">Limpiar todos los filtros</button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Mobile Filter Modal */}
            {showMobileFilters && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-end lg:hidden">
                    <div className="w-80 bg-white dark:bg-neutral-900 h-full p-6 overflow-y-auto animate-slide-in-right">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Filtros</h3>
                            <button onClick={() => setShowMobileFilters(false)}><X className="w-6 h-6 text-gray-900 dark:text-white" /></button>
                        </div>

                        {/* Mobile Filters Content */}
                        <div className="space-y-6">
                            {/* Categories */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoría</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full p-2 border border-gray-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                                >
                                    <option value="">Todas</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Precio</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full p-2 border border-gray-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full p-2 border border-gray-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Calificación</label>
                                <div className="space-y-2">
                                    {[4, 3, 2, 1].map((star) => (
                                        <label key={star} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="rating_mobile"
                                                checked={minRating === star.toString()}
                                                onChange={() => setMinRating(star.toString())}
                                                className="text-blue-600"
                                            />
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                                    />
                                                ))}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={applyFilters}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                            >
                                Aplicar Filtros
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
            <div className="md:hidden">
                <BottomNav />
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
