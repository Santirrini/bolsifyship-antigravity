'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { bannerService, Banner } from '@/services/bannerService';

export default function MiddleBanner() {
    const [banner, setBanner] = useState<Banner | null>(null);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const banners = await bannerService.getAll('home_middle', true);
                if (banners.length > 0) {
                    setBanner(banners[0]); // Use the first active banner for this position
                }
            } catch (error) {
                console.error("Error fetching middle banner:", error);
            }
        };

        fetchBanner();
    }, []);

    const handleBannerClick = async () => {
        if (banner) {
            await bannerService.trackClick(banner.id);
        }
    };

    // Determine link URL based on action_type
    const getLinkUrl = (b: Banner) => {
        if (b.action_type === 'category') return `/search?category=${b.action_value}`;
        if (b.action_type === 'product') return `/products/${b.action_value}`;
        return b.link_url || b.action_value || "/search";
    };

    if (!banner) {
        // Fallback if no banner is set
        return (
            <section className="py-12 px-4">
                <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative h-64 md:h-80 group">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop')" }}
                    ></div>
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6 text-white">
                        <h3 className="text-3xl md:text-5xl font-bold mb-4">Oferta Especial de Temporada</h3>
                        <p className="text-lg mb-8 max-w-xl">Aprovecha descuentos increíbles en toda la tienda por tiempo limitado.</p>
                        <Link href="/search?on_sale=true" className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors inline-block">
                            Ver Descuentos
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative h-64 md:h-80 group">
                {/* Responsive Image */}
                <picture className="absolute inset-0">
                    {banner.image_mobile && (
                        <source media="(max-width: 768px)" srcSet={banner.image_mobile} />
                    )}
                    <img
                        src={banner.image_url}
                        alt={banner.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </picture>

                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6 text-white">
                    <h3 className="text-3xl md:text-5xl font-bold mb-4">{banner.title}</h3>
                    {banner.description && (
                        <p className="text-lg mb-8 max-w-xl">{banner.description}</p>
                    )}
                    <Link
                        href={getLinkUrl(banner)}
                        onClick={handleBannerClick}
                        className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors inline-block"
                    >
                        {banner.highlight_text || "Ver Más"}
                    </Link>
                </div>
            </div>
        </section>
    );
}
