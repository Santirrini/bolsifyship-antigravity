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
        <div className="rounded-xl bg-muted/30 p-5 border border-border/50 hover:border-border transition-colors">
            <div className="flex items-center gap-4 mb-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-background border border-border shadow-sm">
                    {store.logo_url ? (
                        <Image
                            src={store.logo_url}
                            alt={store.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-muted">
                            <StoreIcon size={20} />
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="text-base font-semibold text-foreground">{store.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500 font-medium">
                            98% Positive
                        </span>
                        <span className="text-muted-foreground/30">•</span>
                        <span>Official Store</span>
                    </div>
                </div>
            </div>

            {store.description && (
                <p className="mb-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {store.description}
                </p>
            )}

            <Link
                href={`/store/${store.id}`}
                className="block w-full rounded-lg bg-background border border-border px-4 py-2.5 text-center text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-all shadow-sm"
            >
                Visit Store
            </Link>
        </div>
    );
}
