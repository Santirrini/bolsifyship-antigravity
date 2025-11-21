import React, { useState, useEffect } from 'react';
import { userService } from '@/services/user';
import { productService } from '@/services/product';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

export default function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            const user = await userService.getProfile();
            if (user && user.id) {
                const wishlistData = await userService.getWishlist(user.id);

                if (wishlistData.length > 0) {
                    const productIds = wishlistData.map((item: any) => item.product_id);
                    const products = await productService.getProductsByIds(productIds);
                    setWishlistItems(products);
                } else {
                    setWishlistItems([]);
                }
            }
        } catch (error) {
            console.error('Error loading wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId: number) => {
        try {
            const user = await userService.getProfile();
            if (user && user.id) {
                await userService.toggleWishlist(user.id, productId);
                setWishlistItems(prev => prev.filter(item => item.id !== productId));
                toast.success('Eliminado de favoritos');
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            toast.error('Error al eliminar');
        }
    };

    const handleAddToCart = (product: any) => {
        addToCart(product);
        toast.success('Añadido al carrito');
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Mis Favoritos</h2>

            {wishlistItems.length === 0 ? (
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
                    {wishlistItems.map((product) => (
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
                                        onClick={() => handleRemove(product.id)}
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
