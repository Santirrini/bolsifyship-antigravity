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
                    <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20">
                        {product.category}
                    </span>
                    {product.rating >= 4.5 && (
                        <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20">
                            Top Rated
                        </span>
                    )}
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-display">
                    {product.name}
                </h1>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(product.rating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-muted text-muted/30'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                        {product.rating} <span className="text-muted-foreground/30 mx-1">•</span> {product.reviews} reviews
                    </span>
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold tracking-tight text-foreground">
                        ${product.price.toFixed(2)}
                    </span>
                    {product.discount_price && (
                        <span className="text-lg text-muted-foreground line-through decoration-muted-foreground/50">
                            ${product.discount_price.toFixed(2)}
                        </span>
                    )}
                </div>
                {product.discount_price && (
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-500">
                        Save ${(product.discount_price - product.price).toFixed(2)} ({(100 - (product.price / product.discount_price) * 100).toFixed(0)}%)
                    </p>
                )}
            </div>

            <div className="prose prose-sm text-muted-foreground leading-relaxed max-w-none dark:prose-invert">
                <p>{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                    <span className="font-medium text-foreground">In Stock</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500 ring-4 ring-blue-500/20" />
                    <span className="font-medium text-foreground">Fast Delivery</span>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row pt-6 border-t border-border">
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-foreground px-8 py-3.5 text-base font-semibold text-background shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                    <ShoppingCart className="h-5 w-5" />
                    {isAdding ? 'Added' : 'Add to Cart'}
                </button>
                <button
                    className="flex items-center justify-center rounded-xl border border-border bg-background px-4 py-3.5 hover:bg-accent hover:text-accent-foreground transition-all active:scale-[0.98]"
                    aria-label="Add to wishlist"
                >
                    <Heart className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
