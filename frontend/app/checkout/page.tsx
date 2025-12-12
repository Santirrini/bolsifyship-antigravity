'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { orderService } from '@/services/order';
import { toast } from 'sonner';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import ShippingForm from '@/components/checkout/ShippingForm';
import PaymentForm from '@/components/checkout/PaymentForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, clearCart, cartTotal } = useCart();
    const [currentStep, setCurrentStep] = useState(1);
    const [shippingAddress, setShippingAddress] = useState('');
    const [paymentToken, setPaymentToken] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Redirect if cart is empty
    React.useEffect(() => {
        if (cart.length === 0) {
            router.push('/');
            toast.error('Your cart is empty');
        }
    }, [cart, router]);

    const handleShippingSubmit = (address: string) => {
        setShippingAddress(address);
        setCurrentStep(2);
        window.scrollTo(0, 0);
    };

    const handlePaymentSubmit = (token: string) => {
        setPaymentToken(token);
        setCurrentStep(3);
        window.scrollTo(0, 0);
    };

    const handlePlaceOrder = async () => {
        if (!shippingAddress || !paymentToken) return;

        setIsProcessing(true);
        try {
            const orderData = {
                items: cart.map(item => ({
                    product: item.id,
                    title: item.name,
                    quantity: item.quantity,
                    price: item.price.toString()
                })),
                shipping_address: shippingAddress,
                payment_token: paymentToken
            };

            await orderService.createOrder(orderData);
            clearCart();
            toast.success('Order placed successfully!');
            router.push('/profile'); // Redirect to profile/orders
        } catch (error) {
            console.error('Failed to place order:', error);
            toast.error('Failed to place order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (cart.length === 0) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

                <CheckoutSteps currentStep={currentStep} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <ShippingForm onSubmit={handleShippingSubmit} />
                            )}

                            {currentStep === 2 && (
                                <PaymentForm
                                    onSubmit={handlePaymentSubmit}
                                    onBack={() => setCurrentStep(1)}
                                />
                            )}

                            {currentStep === 3 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800"
                                >
                                    <h2 className="text-xl font-semibold mb-6">Review Order</h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Shipping Address</p>
                                            <p className="font-medium">{shippingAddress}</p>
                                        </div>

                                        <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Payment Method</p>
                                            <p className="font-medium">Credit / Debit Card (Simulated)</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setCurrentStep(2)}
                                            className="flex-1 py-4 rounded-xl font-medium border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                                            disabled={isProcessing}
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={isProcessing}
                                            className="flex-1 bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                `Pay $${cartTotal.toFixed(2)}`
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar Summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary />
                    </div>
                </div>
            </div>
        </div>
    );
}
