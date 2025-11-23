'use client';

import { ProductDetail } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';

interface ProductInfoProps {
    product: ProductDetail;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = () => {
        setIsAdding(true);
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || '/placeholder.png',
        });
        setTimeout(() => setIsAdding(false), 500);
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                        {product.category}
                    </span>
                    {product.rating >= 4.5 && (
                        <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-900/30 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                            Top Rated
                        </span>
                    )}
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl font-display">
                    {product.name}
                </h1>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(product.rating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-zinc-200 dark:fill-zinc-700 text-zinc-200 dark:text-zinc-700'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {product.rating} <span className="text-zinc-300 dark:text-zinc-700 mx-1">•</span> {product.reviews} reviews
                    </span>
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        ${product.price.toFixed(2)}
                    </span>
                    {product.discount_price && (
                        <span className="text-lg text-zinc-400 line-through decoration-zinc-400/50">
                            ${product.discount_price.toFixed(2)}
                        </span>
                    )}
                </div>
                {product.discount_price && (
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        Save ${(product.discount_price - product.price).toFixed(2)} ({(100 - (product.price / product.discount_price) * 100).toFixed(0)}%)
                    </p>
                )}
            </div>

            <div className="prose prose-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-none">
                <p>{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    <span className="font-medium text-zinc-900 dark:text-white">In Stock</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                    <span className="font-medium text-zinc-900 dark:text-white">Fast Delivery</span>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row pt-6 border-t border-zinc-100 dark:border-neutral-800">
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 dark:bg-white px-8 py-4 text-base font-bold text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/20 dark:shadow-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    <ShoppingCart className="h-5 w-5" />
                    {isAdding ? 'Added' : 'Add to Cart'}
                </button>
                <button
                    className="flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-neutral-800 px-5 py-4 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-neutral-700 transition-all active:scale-[0.98]"
                    aria-label="Add to wishlist"
                >
                    <Heart className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
}
