'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductGalleryProps {
    image?: string;
    name: string;
}

export default function ProductGallery({ image, name }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(image || '/placeholder.png');

    return (
        <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                <Image
                    src={selectedImage}
                    alt={name}
                    fill
                    className="object-cover object-center"
                    priority
                />
            </div>
            {/* Thumbnail placeholder - in a real app, we'd map over multiple images */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {[selectedImage].map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${selectedImage === img ? 'border-black' : 'border-transparent'
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`${name} thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
