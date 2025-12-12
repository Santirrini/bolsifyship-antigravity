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
        <div className="group relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-neutral-800 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1">
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-neutral-800">
                {!imageError && product.image ? (
                    <Image
                        src={product.image}
                        alt={product.title || product.name || 'Product'}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-900">
                        <span className="text-4xl font-bold text-gray-300 dark:text-neutral-700 select-none">
                            {(product.title || product.name || '?').charAt(0)}
                        </span>
                    </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-x-0 bottom-0 p-2 md:p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex gap-2 justify-center">
                        <button className="flex-1 bg-white text-black py-2 md:py-2.5 rounded-full font-medium text-xs md:text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5 md:gap-2">
                            <ShoppingCart size={14} className="md:w-4 md:h-4" />
                            <span className="hidden sm:inline">Add to Cart</span>
                            <span className="sm:hidden">Add</span>
                        </button>
                        <Link href={`/product/${product.id}`} className="p-2 md:p-2.5 bg-black/50 text-white backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors">
                            <Eye size={16} className="md:w-5 md:h-5" />
                        </Link>
                    </div>
                </div>

                {/* Badges */}
                {hasDiscount && (
                    <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-500 text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
                        {discountPercent}% OFF
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-2.5 md:p-5">
                <div className="mb-1 md:mb-2">
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                        <Link href={`/product/${product.id}`}>
                            {product.title || product.name}
                        </Link>
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1 line-clamp-1 md:line-clamp-2 min-h-[1.5em] md:min-h-[2.5em]">
                        {product.description}
                    </p>
                </div>

                <div className="flex items-end justify-between mt-2 md:mt-4">
                    <div className="flex flex-col">
                        <span className="text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                            ${displayPrice.toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-[10px] md:text-xs text-gray-400 line-through">
                                ${priceVal.toFixed(2)}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-0.5 md:gap-1 text-xs md:text-sm text-yellow-500 mb-0.5">
                        <span>★</span>
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                            {product.rating ? product.rating.toFixed(1) : 'New'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
