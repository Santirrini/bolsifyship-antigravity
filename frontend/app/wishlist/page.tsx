'use client';

import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Trash2, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                <div className="w-24 h-24 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tu lista de deseos está vacía</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
                    Guarda los productos que te gustan para comprarlos más tarde.
                </p>
                <Link
                    href="/search"
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                >
                    Explorar Productos <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Tu Lista de Deseos</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden group">
                        <div className="relative aspect-square bg-gray-100 dark:bg-neutral-800">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <button
                                onClick={() => removeFromWishlist(item.id)}
                                className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                                {item.name}
                            </h3>
                            <p className="text-blue-600 font-medium mb-4">
                                ${item.price.toLocaleString()}
                            </p>

                            <button
                                onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })}
                                className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Agregar al Carrito
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
