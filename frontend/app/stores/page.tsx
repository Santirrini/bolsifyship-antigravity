import { Store, Star, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function StoresPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-neutral-950 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                        Directorio de Tiendas
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        Explora nuestros proveedores verificados y descubre productos únicos de vendedores confiables.
                    </p>
                </div>

                {/* Placeholder Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-zinc-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-neutral-800 flex items-center justify-center">
                                    <Store className="w-8 h-8 text-zinc-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Tienda Ejemplo {item}</h3>
                                    <div className="flex items-center gap-1 text-amber-400 text-sm">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="font-medium text-zinc-700 dark:text-zinc-300">4.8</span>
                                        <span className="text-zinc-400">(120 reviews)</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-2">
                                Vendedor especializado en productos de alta calidad con envíos rápidos y seguros.
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-neutral-800">
                                <div className="flex items-center gap-1 text-xs text-zinc-500">
                                    <MapPin className="w-3 h-3" />
                                    <span>Ciudad de México</span>
                                </div>
                                <Link
                                    href={`/store/${item}`}
                                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Visitar Tienda
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
