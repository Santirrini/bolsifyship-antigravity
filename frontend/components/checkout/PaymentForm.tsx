'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentFormProps {
    onSubmit: (token: string) => void;
    onBack: () => void;
}

export default function PaymentForm({ onSubmit, onBack }: PaymentFormProps) {
    const [selectedMethod, setSelectedMethod] = useState<string>('card');
    const [isTokenizing, setIsTokenizing] = useState(false);

    // Form states
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [holder, setHolder] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsTokenizing(true);

        // Simulate PSP Tokenization (e.g., Stripe.createToken)
        // In a real app, this would be an API call to the PSP
        setTimeout(() => {
            setIsTokenizing(false);

            // Mock validation
            if (selectedMethod === 'card' && (!cardNumber || !expiry || !cvc || !holder)) {
                toast.error("Please fill in all card details");
                return;
            }

            // Generate mock token
            const mockToken = `tok_${selectedMethod}_${Date.now()}`;
            onSubmit(mockToken);
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800"
        >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                Secure Payment
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                    <div
                        onClick={() => setSelectedMethod('card')}
                        className={`
                            p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between
                            ${selectedMethod === 'card'
                                ? 'border-black dark:border-white bg-gray-50 dark:bg-neutral-800'
                                : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300'}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <CreditCard className="w-6 h-6" />
                            <div>
                                <p className="font-medium">Credit / Debit Card</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Safe money transfer using your bank account</p>
                            </div>
                        </div>
                        <div className={`
                            w-5 h-5 rounded-full border-2 flex items-center justify-center
                            ${selectedMethod === 'card' ? 'border-black dark:border-white' : 'border-gray-300'}
                        `}>
                            {selectedMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white" />}
                        </div>
                    </div>

                    <div
                        onClick={() => setSelectedMethod('paypal')}
                        className={`
                            p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between
                            ${selectedMethod === 'paypal'
                                ? 'border-black dark:border-white bg-gray-50 dark:bg-neutral-800'
                                : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300'}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <Wallet className="w-6 h-6" />
                            <div>
                                <p className="font-medium">PayPal</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Pay with your PayPal account</p>
                            </div>
                        </div>
                        <div className={`
                            w-5 h-5 rounded-full border-2 flex items-center justify-center
                            ${selectedMethod === 'paypal' ? 'border-black dark:border-white' : 'border-gray-300'}
                        `}>
                            {selectedMethod === 'paypal' && <div className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white" />}
                        </div>
                    </div>
                </div>

                {/* Simulated Card Input Fields */}
                {selectedMethod === 'card' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4 mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800"
                    >
                        <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="Card Number"
                            className="w-full p-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                placeholder="MM / YY"
                                className="w-full p-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            />
                            <input
                                type="text"
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value)}
                                placeholder="CVC"
                                className="w-full p-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            />
                        </div>
                        <input
                            type="text"
                            value={holder}
                            onChange={(e) => setHolder(e.target.value)}
                            placeholder="Card Holder Name"
                            className="w-full p-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        />
                    </motion.div>
                )}

                <div className="flex gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={isTokenizing}
                        className="flex-1 py-4 rounded-xl font-medium border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={isTokenizing}
                        className="flex-1 bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isTokenizing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Review Order'
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
