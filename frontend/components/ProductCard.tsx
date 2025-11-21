import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useUI } from '@/context/UIContext';
import Link from 'next/link';

interface ProductProps {
    id: number;
    title: string;
    price: number;
    oldPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    tag?: string;
}

export default function ProductCard({
    id,
    title,
    price,
    oldPrice,
    rating,
    reviews,
    image,
    tag,
}: ProductProps) {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { openCart, openWishlist } = useUI();
    const isWishlisted = isInWishlist(id);

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
            removeFromWishlist(id);
        } else {
            addToWishlist({ id, name: title, price, image });
            openWishlist();
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({ id, name: title, price, image });
        openCart();
    };

    return (
        <div className="group bg-white dark:bg-neutral-900 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-zinc-200 dark:border-neutral-800 overflow-hidden relative">
            {/* Tag */}
            {tag && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    {tag}
                </span>
            )}

            {/* Wishlist Button */}
            <button
                onClick={handleToggleWishlist}
                className={`absolute top-3 right-3 p-2 backdrop-blur-sm rounded-full transition-all z-10 transform translate-y-2 group-hover:translate-y-0 duration-300 ${isWishlisted
                    ? 'bg-red-50 dark:bg-red-950/50 text-red-500 opacity-100'
                    : 'bg-white/80 dark:bg-black/50 text-zinc-400 hover:text-red-500 hover:bg-white dark:hover:bg-neutral-800 opacity-0 group-hover:opacity-100'
                    }`}
            >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            {/* Image */}
            <div className="relative h-64 overflow-hidden bg-zinc-50 dark:bg-neutral-800">
                <Link href={`/product/${id}`} className="block w-full h-full">
                    <img
                        src={image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E'}
                        alt={title}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                </Link>

                {/* Quick Add Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-white dark:bg-neutral-800 text-gray-900 dark:text-white font-bold py-3 rounded-xl shadow-lg hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center justify-center gap-2 transition-colors pointer-events-auto"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Añadir al Carrito
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                    ))}
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({reviews})</span>
                </div>

                <Link href={`/product/${id}`} className="block">
                    <h3 className="font-semibold text-zinc-900 dark:text-white mb-2 line-clamp-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        {title}
                    </h3>
                </Link>

                <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">${price.toFixed(2)}</span>
                    {oldPrice && (
                        <span className="text-sm text-gray-400 line-through">${oldPrice.toFixed(2)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
