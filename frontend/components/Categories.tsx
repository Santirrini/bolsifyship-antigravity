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
        <section className="py-12 px-4 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Categorías Populares</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Explora nuestras colecciones más visitadas</p>
                </div>
                <a href="#" className="hidden md:block text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300">Ver todas &rarr;</a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {categories.map((cat, idx) => (
                    <Link href={`/search?category=${cat.name}`} key={idx} className="group flex flex-col items-center p-4 rounded-xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1">
                        <div className={`w-14 h-14 ${cat.color} dark:bg-opacity-20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                            <cat.icon className="w-7 h-7" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
