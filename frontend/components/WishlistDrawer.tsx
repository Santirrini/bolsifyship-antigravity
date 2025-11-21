'use client';

import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';
import SidebarDrawer from './SidebarDrawer';
import Image from 'next/image';
import { Trash2, ShoppingBag, Heart } from 'lucide-react';
import Link from 'next/link';

export default function WishlistDrawer() {
    const { isWishlistOpen, closeWishlist } = useUI();
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    return (
        <SidebarDrawer isOpen={isWishlistOpen} onClose={closeWishlist} title={`Favoritos (${wishlist.length})`}>
            {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                        <Heart className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tu lista está vacía</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Guarda lo que te gusta para después.
                        </p>
                    </div>
                    <button
                        onClick={closeWishlist}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors"
                    >
                        Explorar Productos
                    </button>
                </div>
            ) : (
                <div className="flex flex-col h-full">
                    <div className="flex-1 space-y-4 overflow-y-auto pb-4">
                        {wishlist.map((item) => (
                            <div key={item.id} className="flex gap-4 bg-gray-50 dark:bg-neutral-800/50 p-3 rounded-xl group">
                                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                            {item.name}
                                        </h4>
                                        <button
                                            onClick={() => removeFromWishlist(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-sm font-bold text-blue-600">
                                            ${item.price.toLocaleString()}
                                        </p>
                                        <button
                                            onClick={() => {
                                                addToCart({ id: item.id, name: item.name, price: item.price, image: item.image });
                                                // Optional: close wishlist or show toast
                                            }}
                                            className="p-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
                                            title="Agregar al carrito"
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 dark:border-neutral-800 pt-4 mt-auto bg-white dark:bg-neutral-900">
                        <Link
                            href="/wishlist"
                            onClick={closeWishlist}
                            className="w-full flex items-center justify-center py-3 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-900 dark:text-white font-medium rounded-xl transition-colors"
                        >
                            Ver Lista Completa
                        </Link>
                    </div>
                </div>
            )}
        </SidebarDrawer>
    );
}
