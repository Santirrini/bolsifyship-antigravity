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
        <div className="rounded-2xl bg-card p-6 border border-border">
            <div className="flex items-center gap-4 mb-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-background border border-border shadow-sm">
                    {store.logo_url ? (
                        <Image
                            src={store.logo_url}
                            alt={store.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <StoreIcon size={32} />
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-foreground">{store.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                            Official Store
                        </span>
                        <span>• 98% Positive Feedback</span>
                    </div>
                </div>
            </div>

            {store.description && (
                <p className="mb-6 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {store.description}
                </p>
            )}

            <Link
                href={`/store/${store.id}`}
                className="block w-full rounded-xl bg-background border border-border px-4 py-3 text-center text-sm font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-all shadow-sm"
            >
                Visit Store
            </Link>
        </div>
    );
}
