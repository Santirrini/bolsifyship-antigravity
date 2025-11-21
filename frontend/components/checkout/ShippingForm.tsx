'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus } from 'lucide-react';

interface ShippingFormProps {
    onSubmit: (address: string) => void;
}

// Mock addresses for now - in real app, fetch from user profile
const mockAddresses = [
    {
        id: 1,
        name: 'Home',
        address: '123 Main St, New York, NY 10001',
    },
    {
        id: 2,
        name: 'Work',
        address: '456 Corporate Blvd, San Francisco, CA 94105',
    },
];

export default function ShippingForm({ onSubmit }: ShippingFormProps) {
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(mockAddresses[0]?.id || null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newAddress, setNewAddress] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isAddingNew) {
            if (newAddress.trim()) {
                onSubmit(newAddress);
            }
        } else {
            const address = mockAddresses.find(a => a.id === selectedAddressId);
            if (address) {
                onSubmit(address.address);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800"
        >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                    {mockAddresses.map((addr) => (
                        <div
                            key={addr.id}
                            onClick={() => {
                                setSelectedAddressId(addr.id);
                                setIsAddingNew(false);
                            }}
                            className={`
                                p-4 rounded-xl border-2 cursor-pointer transition-all
                                ${selectedAddressId === addr.id && !isAddingNew
                                    ? 'border-black dark:border-white bg-gray-50 dark:bg-neutral-800'
                                    : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300'}
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{addr.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{addr.address}</p>
                                </div>
                                <div className={`
                                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                                    ${selectedAddressId === addr.id && !isAddingNew
                                        ? 'border-black dark:border-white'
                                        : 'border-gray-300'}
                                `}>
                                    {(selectedAddressId === addr.id && !isAddingNew) && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div
                        onClick={() => setIsAddingNew(true)}
                        className={`
                            p-4 rounded-xl border-2 cursor-pointer transition-all border-dashed
                            ${isAddingNew
                                ? 'border-black dark:border-white bg-gray-50 dark:bg-neutral-800'
                                : 'border-gray-300 dark:border-neutral-700 hover:border-gray-400'}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <Plus className="w-5 h-5" />
                            <span className="font-medium">Add New Address</span>
                        </div>

                        {isAddingNew && (
                            <div className="mt-4" onClick={e => e.stopPropagation()}>
                                <textarea
                                    value={newAddress}
                                    onChange={(e) => setNewAddress(e.target.value)}
                                    placeholder="Enter full address..."
                                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
                                    rows={3}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!selectedAddressId && !newAddress}
                    className="w-full mt-6 bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue to Payment
                </button>
            </form>
        </motion.div>
    );
}
