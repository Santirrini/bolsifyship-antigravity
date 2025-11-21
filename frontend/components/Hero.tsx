'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const slides = [
    {
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        subtitle: "NUEVA COLECCIÓN 2024",
        title: "Estilo que define",
        highlight: "tu personalidad",
        description: "Descubre las últimas tendencias en moda y accesorios con descuentos exclusivos de hasta un 50%."
    },
    {
        image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2001&auto=format&fit=crop",
        subtitle: "TECNOLOGÍA AVANZADA",
        title: "El futuro en",
        highlight: "tus manos",
        description: "Encuentra los gadgets más innovadores y lleva tu productividad al siguiente nivel."
    },
    {
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
        subtitle: "OFERTAS ESPECIALES",
        title: "Tiempo de",
        highlight: "renovarse",
        description: "Aprovecha nuestros precios de lanzamiento en relojes inteligentes y accesorios."
    }
];

export default function Hero() {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-[500px] md:h-[600px] bg-gray-900 text-white overflow-hidden group">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-70 transition-all duration-1000 ease-in-out transform hover:scale-105"
                style={{ backgroundImage: `url('${slides[current].image}')` }}
            ></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-90"></div>

            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 z-10 max-w-4xl mx-auto">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-600/30 border border-blue-500/50 text-blue-300 text-sm font-semibold mb-6 backdrop-blur-sm animate-fade-in">
                    {slides[current].subtitle}
                </span>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight drop-shadow-lg transition-all duration-500">
                    {slides[current].title} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        {slides[current].highlight}
                    </span>
                </h2>
                <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl drop-shadow-md font-light">
                    {slides[current].description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button className="group bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 shadow-lg shadow-white/10">
                        Comprar Ahora
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="bg-transparent border-2 border-white/30 hover:bg-white/10 text-white font-semibold py-3 px-8 rounded-full transition-all backdrop-blur-sm">
                        Ver Catálogo
                    </button>
                </div>
            </div>

            {/* Carousel Controls */}
            <button
                onClick={prevSlide}
                className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 border border-white/20 backdrop-blur-md rounded-full hover:bg-white/20 text-white transition-all cursor-pointer z-20"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 border border-white/20 backdrop-blur-md rounded-full hover:bg-white/20 text-white transition-all cursor-pointer z-20"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {slides.map((_, idx) => (
                    <div
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${current === idx
                            ? 'bg-blue-500 ring-4 ring-blue-500/30 w-6'
                            : 'bg-white/50 hover:bg-white'
                            }`}
                    ></div>
                ))}
            </div>
        </div>
    );
}
