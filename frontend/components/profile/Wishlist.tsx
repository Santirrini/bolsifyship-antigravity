import React from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

export default function Wishlist() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleRemove = (productId: number, productName: string) => {
        removeFromWishlist(productId);
        toast.success(`${productName} eliminado de favoritos`);
    };

    const handleAddToCart = (product: any) => {
        addToCart(product);
        toast.success('Añadido al carrito');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Mis Favoritos</h2>

            {wishlist.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <Heart className="mx-auto h-12 w-12 text-neutral-300" />
                    <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-white">Lista vacía</h3>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">No tienes artículos en tus favoritos.</p>
                    <Link href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-500 font-medium text-sm">
                        Explorar productos
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map((product) => (
                        <div key={product.id} className="bg-white dark:bg-neutral-900 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-800 flex gap-4">
                            <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex-shrink-0 overflow-hidden">
                                <img
                                    src={product.image || "/placeholder.png"}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-neutral-900 dark:text-white line-clamp-2">
                                    {product.name}
                                </h3>
                                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                                    ${product.price}
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                        title="Añadir al carrito"
                                    >
                                        <ShoppingCart size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleRemove(product.id, product.name)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-auto"
                                        title="Eliminar de favoritos"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
