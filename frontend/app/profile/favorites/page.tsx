"use client";

import React from 'react';
import Wishlist from '@/components/profile/Wishlist';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link href="/profile" className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <ArrowLeft size={20} className="mr-2" />
                        Volver al Perfil
                    </Link>
                </div>
                <Wishlist />
            </div>
        </div>
    );
}
