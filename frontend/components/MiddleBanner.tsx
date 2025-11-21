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

    if (!banner) {
        // Fallback if no banner is set
        return (
            <section className="py-12 px-4">
                <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative h-64 md:h-80">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
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
            <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative h-64 md:h-80">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${banner.image_url}')` }}
                ></div>
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6 text-white">
                    <h3 className="text-3xl md:text-5xl font-bold mb-4">{banner.title}</h3>
                    {banner.description && (
                        <p className="text-lg mb-8 max-w-xl">{banner.description}</p>
                    )}
                    <Link href={banner.link_url || "/search"} className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors inline-block">
                        {banner.highlight_text || "Ver Más"}
                    </Link>
                </div>
            </div>
        </section>
    );
}
