'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

export default function OrderSummary() {
    const { cart, cartTotal } = useCart();
    const shippingCost = 0; // Free shipping for now
    const total = cartTotal + shippingCost;

    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                                src={item.image || '/placeholder.png'}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-neutral-800">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                    <span className="font-medium text-green-500">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-100 dark:border-neutral-800">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
