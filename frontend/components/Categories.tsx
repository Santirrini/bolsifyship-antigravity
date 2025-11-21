import { Monitor, Smartphone, Tv, Home, Watch, Headphones, Camera, Gamepad } from 'lucide-react';
import Link from 'next/link';

const categories = [
    { name: 'Electrónica', icon: Monitor, color: 'bg-blue-100 text-blue-600' },
    { name: 'Móviles', icon: Smartphone, color: 'bg-purple-100 text-purple-600' },
    { name: 'Televisores', icon: Tv, color: 'bg-pink-100 text-pink-600' },
    { name: 'Hogar', icon: Home, color: 'bg-green-100 text-green-600' },
    { name: 'Relojes', icon: Watch, color: 'bg-orange-100 text-orange-600' },
    { name: 'Audio', icon: Headphones, color: 'bg-red-100 text-red-600' },
    { name: 'Cámaras', icon: Camera, color: 'bg-indigo-100 text-indigo-600' },
    { name: 'Gaming', icon: Gamepad, color: 'bg-yellow-100 text-yellow-600' },
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
                    <a href="#" className="group flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                        Ver todas
                        <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
                    {categories.map((cat, idx) => (
                        <Link
                            href={`/search?category=${cat.name}`}
                            key={idx}
                            className="group relative flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:border-blue-100 dark:hover:border-blue-900/30 transition-all duration-300 cursor-pointer hover:-translate-y-2"
                        >
                            <div className={`w-16 h-16 ${cat.color} bg-opacity-10 dark:bg-opacity-20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}>
                                <cat.icon className="w-8 h-8" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {cat.name}
                            </span>

                            {/* Hover Gradient Overlay */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
