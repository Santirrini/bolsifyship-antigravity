'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductGalleryProps {
    image?: string;
    name: string;
}

export default function ProductGallery({ image, images = [], name }: { image?: string; images?: string[]; name: string }) {
    // Ensure we have at least the main image
    const safeImages = Array.isArray(images) ? images : [];
    const allImages = [image || '/placeholder.png', ...safeImages].filter(Boolean);
    // Deduplicate just in case
    const uniqueImages = Array.from(new Set(allImages));

    const [selectedImage, setSelectedImage] = useState(uniqueImages[0]);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted/20 border border-border/50">
                <Image
                    src={selectedImage}
                    alt={name}
                    fill
                    className="object-contain object-center p-6 transition-transform duration-500 lg:hover:scale-105"
                    priority
                />
            </div>
            {uniqueImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {uniqueImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(img)}
                            className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${selectedImage === img
                                ? 'border-primary ring-2 ring-primary/10'
                                : 'border-transparent hover:border-border/80 bg-muted/20'
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${name} view ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
