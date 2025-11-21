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
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {product.category}
                    </span>
                    {product.rating >= 4.5 && (
                        <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                            Top Rated
                        </span>
                    )}
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    {product.name}
                </h1>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-5 w-5 ${i < Math.floor(product.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-200 text-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {product.rating} ({product.reviews} reviews)
                    </span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-bold tracking-tight text-foreground">
                        ${product.price.toFixed(2)}
                    </span>
                    {product.discount_price && (
                        <span className="text-xl text-gray-400 line-through">
                            ${product.discount_price.toFixed(2)}
                        </span>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">
                    Includes taxes and fees. Free shipping on orders over $50.
                </p>
            </div>

            <div className="prose prose-base text-muted-foreground leading-relaxed">
                <p>{product.description}</p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row pt-6 border-t border-border">
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 flex items-center justify-center gap-3 rounded-xl bg-black px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                    <ShoppingCart className="h-5 w-5" />
                    {isAdding ? 'Added to Cart' : 'Add to Cart'}
                </button>
                <button
                    className="flex items-center justify-center rounded-xl border-2 border-border px-6 py-4 hover:bg-accent hover:border-accent-foreground/20 transition-all active:scale-[0.98]"
                    aria-label="Add to wishlist"
                >
                    <Heart className="h-6 w-6 text-muted-foreground" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="font-medium text-foreground">In Stock</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="font-medium text-foreground">Fast Delivery</span>
                </div>
            </div>
        </div>
    );
}
