'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Clock, MessageCircle, UserPlus } from 'lucide-react';
import { Store, MOCK_PRODUCTS } from '@/services/store';

interface StoreCardProps {
    store: Store;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
    // Mock top products for preview (in a real app, these would come from the API)
    const topProducts = MOCK_PRODUCTS.slice(0, 3);

    return (
        <Link href={`/stores/${store.id}`} className="group block bg-card dark:bg-zinc-900/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Banner */}
            <div className="relative h-32 bg-muted">
                {store.banner_url ? (
                    <Image
                        src={store.banner_url}
                        alt={`${store.name} banner`}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-muted to-accent" />
                )}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
            </div>

            {/* Content */}
            <div className="px-5 pb-5">
                {/* Logo & Header */}
                <div className="relative flex justify-between items-end -mt-12 mb-4">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-background shadow-md bg-card">
                        <Image
                            src={store.logo_url || `https://ui-avatars.com/api/?name=${store.name}`}
                            alt={store.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <button
                        className="mb-1 flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full shadow-sm hover:bg-primary/90 transition-colors"
                        onClick={(e) => {
                            e.preventDefault();
                            // Handle follow logic here
                        }}
                    >
                        <UserPlus className="w-3.5 h-3.5" />
                        Seguir
                    </button>
                </div>

                {/* Store Info */}
                <div className="mb-5">
                    <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                            {store.name}
                        </h3>
                        <ShieldCheck className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{store.category || 'General Store'}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-5 text-xs font-medium text-muted-foreground bg-muted/50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>5 años</span>
                    </div>
                    <div className="w-px h-3 bg-border" />
                    <div className="flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-green-500" />
                        <span>{store.response_rate || 98}% Respuestas</span>
                    </div>
                </div>

                {/* Product Preview */}
                <div className="grid grid-cols-3 gap-2">
                    {topProducts.map((product) => (
                        <div key={product.id} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default StoreCard;
