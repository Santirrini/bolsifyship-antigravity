'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';

interface RelatedProductsProps {
    products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
    if (products.length === 0) return null;

    return (
        <div className="mt-16 border-t border-border pt-10">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
                You might also like
            </h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {products.map((product) => (
                    <Link key={product.id} href={`/product/${product.id}`} className="group relative block">
                        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-muted/20 border border-border/50 transition-all duration-300 group-hover:border-border group-hover:shadow-sm">
                            <Image
                                src={product.image || '/placeholder.png'}
                                alt={product.name}
                                width={500}
                                height={500}
                                className="h-full w-full object-contain object-center p-4 transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="mt-4 flex justify-between items-start gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                    <span aria-hidden="true" className="absolute inset-0" />
                                    {product.name}
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">{product.category}</p>
                            </div>
                            <p className="text-sm font-semibold text-foreground whitespace-nowrap">${product.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
