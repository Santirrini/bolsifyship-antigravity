'use client';

import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';
import SidebarDrawer from './SidebarDrawer';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
    const { isCartOpen, closeCart } = useUI();
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    return (
        <SidebarDrawer isOpen={isCartOpen} onClose={closeCart} title={`Tu Carrito (${cart.length})`}>
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tu carrito está vacío</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            ¡Agrega algunos productos geniales!
                        </p>
                    </div>
                    <button
                        onClick={closeCart}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors"
                    >
                        Seguir Comprando
                    </button>
                </div>
            ) : (
                <div className="flex flex-col h-full">
                    {/* Cart Items List */}
                    <div className="flex-1 space-y-4 overflow-y-auto pb-4">
                        {cart.map((item) => (
                            <div key={item.id} className="flex gap-4 bg-gray-50 dark:bg-neutral-800/50 p-3 rounded-xl">
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
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-sm font-bold text-blue-600">
                                            ${item.price.toLocaleString()}
                                        </p>
                                        <div className="flex items-center gap-2 bg-white dark:bg-neutral-700 rounded-full p-0.5 shadow-sm">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-neutral-600 text-gray-600 dark:text-gray-300 transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-xs font-medium w-4 text-center text-gray-900 dark:text-white">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-neutral-600 text-gray-600 dark:text-gray-300 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer / Checkout */}
                    <div className="border-t border-gray-100 dark:border-neutral-800 pt-4 mt-auto bg-white dark:bg-neutral-900">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                ${cartTotal.toLocaleString()}
                            </span>
                        </div>
                        <div className="space-y-3">
                            <Link
                                href="/checkout" // Assuming checkout page exists or will exist
                                onClick={closeCart}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all"
                            >
                                Proceder al Pago <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/cart"
                                onClick={closeCart}
                                className="w-full flex items-center justify-center py-3 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-900 dark:text-white font-medium rounded-xl transition-colors"
                            >
                                Ver Carrito Completo
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </SidebarDrawer>
    );
}
