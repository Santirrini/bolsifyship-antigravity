'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { bannerService, Banner } from '@/services/bannerService';

const defaultSlides = [
    {
        image_url: "/hero-image.png",
        subtitle: "NUEVA COLECCIÓN 2025",
        title: "Redefine tu",
        highlight_text: "Estilo Digital",
        description: "Descubre la fusión perfecta entre moda y tecnología. Calidad premium, diseños exclusivos y envío inmediato.",
        link_url: "/search"
    },
    {
        image_url: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2001&auto=format&fit=crop",
        subtitle: "TECNOLOGÍA DE PUNTA",
        title: "Innovación en",
        highlight_text: "tus manos",
        description: "Explora nuestra selección curada de gadgets smart tech.",
        link_url: "/search?category=Electronics"
    }
];

export default function Hero() {
    const [current, setCurrent] = useState(0);
    const [slides, setSlides] = useState<any[]>(defaultSlides);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const banners = await bannerService.getAll('hero', true);
                if (banners.length > 0) {
                    setSlides(banners);
                }
            } catch (error) {
                console.error("Error fetching hero banners:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    const nextSlide = () => {
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    if (loading) {
        return <div className="w-full h-[500px] md:h-[600px] bg-gray-900 animate-pulse"></div>;
    }

    const handleSlideClick = async (slide: any) => {
        if (slide.id) {
            await bannerService.trackClick(slide.id);
        }
    };

    const getLinkUrl = (slide: any) => {
        if (slide.action_type === 'category') return `/search?category=${slide.action_value}`;
        if (slide.action_type === 'product') return `/products/${slide.action_value}`;
        return slide.link_url || slide.action_value || "/search";
    };

    return (
        <div className="relative w-full h-[500px] md:h-[600px] bg-gray-900 text-white overflow-hidden group">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Background Image */}
                    <picture className="absolute inset-0">
                        {slide.image_mobile && (
                            <source media="(max-width: 768px)" srcSet={slide.image_mobile} />
                        )}
                        <img
                            src={slide.image_url}
                            alt={slide.title}
                            className={`w-full h-full object-cover transform transition-transform duration-[10000ms] ease-linear ${index === current ? 'scale-110' : 'scale-100'}`}
                        />
                    </picture>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-90"></div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 max-w-4xl mx-auto">
                        <div className={`transition-all duration-1000 delay-300 transform ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            {slide.subtitle && (
                                <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs tracking-widest font-bold uppercase mb-6 shadow-xl">
                                    {slide.subtitle}
                                </span>
                            )}
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tighter drop-shadow-2xl">
                                {slide.title} <br />
                                {slide.highlight_text && (
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 animate-gradient-x">
                                        {slide.highlight_text}
                                    </span>
                                )}
                            </h2>
                            {slide.description && (
                                <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-xl mx-auto drop-shadow-lg font-medium leading-relaxed">
                                    {slide.description}
                                </p>
                            )}
                            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center">
                                <Link
                                    href={getLinkUrl(slide)}
                                    onClick={() => handleSlideClick(slide)}
                                    className="group bg-white text-black hover:bg-gray-100 font-bold py-4 px-10 rounded-full transition-all transform hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2"
                                >
                                    Comprar Ahora
                                    <ArrowRight className="w-5 h-5 group-hover:bg-black group-hover:text-white rounded-full p-0.5 transition-colors" />
                                </Link>
                                <Link href="/search" className="bg-black/30 border border-white/30 hover:bg-black/50 text-white font-semibold py-4 px-10 rounded-full transition-all backdrop-blur-md flex items-center justify-center hover:border-white/60">
                                    Ver Catálogo
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Carousel Controls */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 border border-white/20 backdrop-blur-md rounded-full hover:bg-white/20 text-white transition-all cursor-pointer z-20 hover:scale-110"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 border border-white/20 backdrop-blur-md rounded-full hover:bg-white/20 text-white transition-all cursor-pointer z-20 hover:scale-110"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                        {slides.map((_, idx) => (
                            <div
                                key={idx}
                                onClick={() => setCurrent(idx)}
                                className={`h-3 rounded-full cursor-pointer transition-all duration-300 ${current === idx
                                    ? 'bg-white ring-4 ring-white/30 w-8'
                                    : 'bg-white/50 hover:bg-white w-3'
                                    }`}
                            ></div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
