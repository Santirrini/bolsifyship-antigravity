'use client';

import { Store } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';
import { Store as StoreIcon } from 'lucide-react';

interface StoreInfoCardProps {
    store: Store;
}

export default function StoreInfoCard({ store }: StoreInfoCardProps) {
    return (
        <div className="rounded-3xl bg-zinc-50 dark:bg-neutral-900 p-6 transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full bg-white dark:bg-neutral-800 shadow-sm">
                    {store.logo_url ? (
                        <Image
                            src={store.logo_url}
                            alt={store.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-400 bg-zinc-100 dark:bg-neutral-800">
                            <StoreIcon size={24} />
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{store.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                            98% Positive
                        </span>
                        <span className="text-zinc-300 dark:text-zinc-700">•</span>
                        <span>Official Store</span>
                    </div>
                </div>
            </div>

            {store.description && (
                <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {store.description}
                </p>
            )}

            <Link
                href={`/store/${store.id}`}
                className="block w-full rounded-xl bg-white dark:bg-neutral-800 border border-zinc-200 dark:border-neutral-700 px-4 py-3 text-center text-sm font-semibold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-neutral-700 transition-all shadow-sm hover:shadow"
            >
                Visit Store
            </Link>
        </div>
    );
}
