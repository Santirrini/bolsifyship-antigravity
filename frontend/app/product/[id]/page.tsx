'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { catalogService, Product } from '@/services/catalog';
import { useCart } from '@/context/CartContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft, Star, Share2, Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await catalogService.getProduct(id);
                setProduct(data);
            } catch (error) {
                console.error('Failed to fetch product', error);
                toast.error('Failed to load product details');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart({
                id: product.id,
                name: product.title,
                price: parseFloat(product.price),
                image: product.image || '',
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-neutral-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-white">
                <h2 className="text-2xl font-bold mb-4">Product not found</h2>
                <Link href="/" className="text-blue-500 hover:underline">Return to Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 transition-colors duration-300">
            <nav className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="mr-4 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                                <ArrowLeft className="h-6 w-6" />
                            </Link>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">Product Details</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/cart" className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative">
                                <ShoppingCart className="h-6 w-6" />
                            </Link>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                    {/* Product Image */}
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl p-4 sm:p-8 shadow-sm border border-gray-100 dark:border-neutral-800 mb-8 lg:mb-0">
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-neutral-800 relative h-96 sm:h-[500px]">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-contain object-center"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 dark:text-neutral-600">
                                    No Image Available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
                            {product.title}
                        </h1>

                        <div className="flex items-center justify-between mb-6">
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                ${product.price}
                            </p>
                            <div className="flex space-x-2">
                                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 dark:text-gray-400 transition-colors">
                                    <Share2 className="h-5 w-5" />
                                </button>
                                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 dark:text-gray-400 transition-colors">
                                    <Heart className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="prose prose-blue dark:prose-invert max-w-none mb-8">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Description</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {product.description || "No description available for this product."}
                            </p>
                        </div>

                        <div className="mt-auto">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 flex items-center justify-center space-x-2"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    <span>Add to Cart</span>
                                </button>
                                <button
                                    className="flex-1 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white font-bold py-4 px-8 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-200"
                                    onClick={() => {
                                        // Implement Buy Now logic (Product -> Cart -> Checkout)
                                        handleAddToCart();
                                        // Typically router.push('/checkout') logic would go here
                                        const a = document.createElement('a');
                                        a.href = '/cart'; // Redirect to cart for now
                                        a.click();
                                    }}
                                >
                                    Buy Now
                                </button>
                            </div>
                            <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                Free shipping on orders over $50
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
