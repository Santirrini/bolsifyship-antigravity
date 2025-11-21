'use client';

import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                <div className="w-24 h-24 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tu carrito está vacío</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
                    Parece que aún no has añadido nada a tu carrito. ¡Explora nuestros productos y encuentra algo que te encante!
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Tu Carrito</h1>

            <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-8">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden">
                        <ul className="divide-y divide-gray-100 dark:divide-neutral-800">
                            {cart.map((item) => (
                                <li key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                                    <div className="relative w-full sm:w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                    {item.name}
                                                </h3>
                                                <p className="text-blue-600 font-medium">
                                                    ${item.price.toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 sm:mt-0">
                                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-neutral-800 rounded-full p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-neutral-700 text-gray-600 dark:text-gray-300 shadow-sm hover:text-blue-600 transition-colors"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-neutral-700 text-gray-600 dark:text-gray-300 shadow-sm hover:text-blue-600 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white sm:hidden">
                                                ${(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block text-right">
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                            ${(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={clearCart}
                            className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" /> Vaciar Carrito
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-4 mt-8 lg:mt-0">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 p-6 sticky top-24">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Resumen del Pedido</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Subtotal</span>
                                <span>${cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Envío</span>
                                <span className="text-green-600 font-medium">Gratis</span>
                            </div>
                            <div className="border-t border-gray-100 dark:border-neutral-800 pt-4 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                                <span>Total</span>
                                <span>${cartTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5">
                            Proceder al Pago
                        </button>

                        <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                            Transacciones seguras y encriptadas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
