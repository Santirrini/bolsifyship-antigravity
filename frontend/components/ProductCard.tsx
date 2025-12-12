import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/services/catalog';
import { ShoppingCart, Eye } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const [imageError, setImageError] = useState(false);

    // Parse prices safely
    const priceVal = parseFloat(typeof product.price === 'string' ? product.price : String(product.price));
    const discountVal = product.discount_price ? parseFloat(typeof product.discount_price === 'string' ? product.discount_price : String(product.discount_price)) : null;

    const hasDiscount = discountVal !== null && discountVal < priceVal;
    const discountPercent = hasDiscount ? Math.round((1 - discountVal / priceVal) * 100) : 0;
    const displayPrice = hasDiscount ? discountVal : priceVal;

    return (
        <div className="group relative block bg-white dark:bg-neutral-900 rounded-lg md:rounded-2xl overflow-hidden border border-gray-100 dark:border-neutral-800 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1">
            {/* Main Clickable Overlay Link */}
            <Link
                href={`/product/${product.id}`}
                className="absolute inset-0 z-0"
                aria-label={`View details for ${product.title || product.name}`}
            />

            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-neutral-800 pointer-events-none">
                {!imageError && product.image ? (
                    <Image
                        src={product.image}
                        alt={product.title || product.name || 'Product'}
                        fill
                        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-900">
                        <span className="text-2xl md:text-4xl font-bold text-gray-300 dark:text-neutral-700 select-none">
                            {(product.title || product.name || '?').charAt(0)}
                        </span>
                    </div>
                )}

                {/* Badges */}
                {hasDiscount && (
                    <div className="absolute top-1.5 left-1.5 md:top-3 md:left-3 bg-red-500 text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-full z-10">
                        -{discountPercent}%
                    </div>
                )}
            </div>

            {/* Interactive Elements Layer */}
            <div className="relative z-10">
                {/* Mobile Add Button (Visible on mobile, hidden on desktop) */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Add to cart logic here
                    }}
                    className="md:hidden absolute bottom-[calc(100%+6px)] right-1.5 bg-white/90 dark:bg-black/90 text-black dark:text-white p-1.5 rounded-full shadow-sm active:scale-95 transition-transform cursor-pointer"
                >
                    <ShoppingCart size={14} />
                </button>

                {/* Desktop Overlay Actions (Hidden on mobile) */}
                <div className="hidden md:block absolute bottom-[100%] inset-x-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-auto">
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Add to cart logic here
                            }}
                            className="flex-1 bg-white text-black py-2.5 rounded-full font-medium text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                        >
                            <ShoppingCart size={16} />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-2 md:p-5 pointer-events-none">
                <div className="mb-1 md:mb-2">
                    <h3 className="text-xs md:text-base font-medium md:font-semibold text-gray-900 dark:text-white line-clamp-2 md:line-clamp-1 h-[2.5em] md:h-auto leading-tight md:leading-normal group-hover:text-blue-600 transition-colors">
                        {product.title || product.name}
                    </h3>
                    {/* Description - Hidden on mobile */}
                    <p className="hidden md:block text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 min-h-[2.5em]">
                        {product.description}
                    </p>
                </div>

                <div className="flex items-end justify-between mt-1 md:mt-4">
                    <div className="flex flex-col">
                        <span className="text-sm md:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                            ${displayPrice.toFixed(0)}
                        </span>
                        {hasDiscount && (
                            <span className="text-[10px] md:text-xs text-gray-400 line-through">
                                ${priceVal.toFixed(0)}
                            </span>
                        )}
                    </div>
                    {/* Rating - Simplified on mobile */}
                    <div className="flex items-center gap-0.5 md:gap-1 text-[10px] md:text-sm text-gray-500 dark:text-gray-400 mb-0.5">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">
                            {product.rating ? product.rating.toFixed(1) : '4.5'}
                        </span>
                        <span className="hidden md:inline text-xs text-gray-400">({product.reviews_count || 12})</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
