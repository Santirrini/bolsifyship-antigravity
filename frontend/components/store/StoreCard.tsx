'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShieldCheck, Clock, MessageCircle } from 'lucide-react';
import { Store, MOCK_PRODUCTS } from '@/services/store';

interface StoreCardProps {
    store: Store;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
    // Mock top products for preview (in a real app, these would come from the API)
    const topProducts = MOCK_PRODUCTS.slice(0, 3);

    return (
        <Link href={`/stores/${store.id}`} className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            {/* Banner */}
            <div className="relative h-32 bg-gray-100">
                {store.banner_url ? (
                    <Image
                        src={store.banner_url}
                        alt={`${store.name} banner`}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-50 to-indigo-50" />
                )}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
            </div>

            {/* Content */}
            <div className="px-5 pb-5">
                {/* Logo & Header */}
                <div className="relative flex justify-between items-start -mt-10 mb-3">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border-4 border-white shadow-sm bg-white">
                        <Image
                            src={store.logo_url || `https://ui-avatars.com/api/?name=${store.name}`}
                            alt={store.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    {store.rating && (
                        <div className="mt-11 flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-semibold text-yellow-700">{store.rating}</span>
                        </div>
                    )}
                </div>

                {/* Store Info */}
                <div className="mb-4">
                    <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                            {store.name}
                        </h3>
                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{store.category || 'General Store'}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-5 text-xs text-gray-500 border-t border-b border-gray-50 py-3">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>5 años vendiendo</span>
                    </div>
                    <div className="w-px h-3 bg-gray-200" />
                    <div className="flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-gray-400" />
                        <span>{store.response_rate || 98}% Respuestas</span>
                    </div>
                </div>

                {/* Product Preview */}
                <div className="grid grid-cols-3 gap-2">
                    {topProducts.map((product) => (
                        <div key={product.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default StoreCard;
