import React from 'react';
import { Monitor, Smartphone, Tv, Home, Watch, Headphones, Camera, Gamepad } from 'lucide-react';
import Link from 'next/link';

const categories = [
    { name: 'Electrónica', icon: Monitor, color: 'bg-zinc-100 text-zinc-700 dark:bg-neutral-800 dark:text-zinc-300' },
    { name: 'Móviles', icon: Smartphone, color: 'bg-zinc-100 text-zinc-700 dark:bg-neutral-800 dark:text-zinc-300' },
    { name: 'Televisores', icon: Tv, color: 'bg-zinc-100 text-zinc-700 dark:bg-neutral-800 dark:text-zinc-300' },
    { name: 'Hogar', icon: Home, color: 'bg-zinc-100 text-zinc-700 dark:bg-neutral-800 dark:text-zinc-300' },
    { name: 'Relojes', icon: Watch, color: 'bg-zinc-100 text-zinc-700 dark:bg-neutral-800 dark:text-zinc-300' },
    { name: 'Audio', icon: Headphones, color: 'bg-zinc-100 text-zinc-700 dark:bg-neutral-800 dark:text-zinc-300' },
    { name: 'Cámaras', icon: Camera, color: 'bg-zinc-100 text-zinc-700 dark:bg-neutral-800 dark:text-zinc-300' },
    { name: 'Gaming', icon: Gamepad, color: 'bg-zinc-100 text-zinc-700 dark:bg-neutral-800 dark:text-zinc-300' },
];

export default function Categories() {
    return (
        <section className="py-16 px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900 -z-10" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-neutral-800 to-transparent" />

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Categorías Populares
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                            Explora nuestras colecciones más visitadas
                        </p>
                    </div>
                    <a href="#" className="group flex items-center text-zinc-900 dark:text-zinc-100 font-semibold hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">
                        Ver todas
                        <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </a>
                </div>

                <div
                    className="flex overflow-x-auto snap-x snap-mandatory pb-8 md:pb-0 md:grid md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6 no-scrollbar px-4 md:px-0 -mx-4 md:mx-0"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                    } as React.CSSProperties}
                >
                    {categories.map((cat, idx) => (
                        <Link
                            href={`/search?category=${cat.name}`}
                            key={idx}
                            className="snap-center flex-shrink-0 w-[140px] md:w-auto md:min-w-0 group relative flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer first:ml-0"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-neutral-800 flex items-center justify-center mb-4 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-300 shadow-sm">
                                <cat.icon className="w-8 h-8 text-gray-600 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300" strokeWidth={1.5} />
                            </div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                {cat.name}
                            </span>

                            {/* Hover Gradient Overlay */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
