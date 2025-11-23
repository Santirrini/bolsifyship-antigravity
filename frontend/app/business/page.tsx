'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Users, ShieldCheck, BarChart3 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '../../context/AuthContext';
import StoreCard from '../../components/store/StoreCard';
import { storeService, Store } from '../../services/store';

export default function BusinessPage() {
    const { user, loading } = useAuth();
    const [myStore, setMyStore] = useState<Store | null>(null);
    const [loadingStore, setLoadingStore] = useState(false);

    useEffect(() => {
        const fetchMyStore = async () => {
            if (user?.role === 'seller') {
                setLoadingStore(true);
                try {
                    // Since we don't have a direct endpoint for "my store", we fetch all and filter
                    // In a real app, this should be a specific endpoint like /stores/me
                    const stores = await storeService.getAllStores({ limit: 100 });
                    const foundStore = stores.find((s: Store) => s.owner_id === user.id);
                    setMyStore(foundStore || null);
                } catch (error) {
                    console.error("Failed to fetch user store", error);
                } finally {
                    setLoadingStore(false);
                }
            }
        };

        if (user && !loading) {
            fetchMyStore();
        }
    }, [user, loading]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col font-sans">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <Footer />
            </div>
        );
    }

    // SELLER VIEW - Contextual Anchoring
    if (user?.role === 'seller') {
        return (
            <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col font-sans">
                <Navbar />

                <div className="flex-1 relative pt-20 pb-32 overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent dark:from-blue-900/20"></div>
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50 -z-10"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 -z-10"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                                    Bienvenido a tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Centro de Negocios</span>
                                </h1>
                                <p className="text-xl text-gray-600 dark:text-gray-300">
                                    Gestiona tu tienda, revisa tus estadísticas y conecta con tus clientes.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 items-start">
                                {/* Left Column: Store Preview */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tu Tienda</h2>
                                        <Link href={myStore ? `/store/${myStore.id}` : '#'} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                            Ver como visitante &rarr;
                                        </Link>
                                    </div>

                                    {loadingStore ? (
                                        <div className="h-64 rounded-2xl bg-gray-100 dark:bg-neutral-900 animate-pulse"></div>
                                    ) : myStore ? (
                                        <StoreCard store={myStore} />
                                    ) : (
                                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-dashed border-gray-300 dark:border-neutral-700 text-center">
                                            <p className="text-gray-500 mb-4">No se encontró información de tu tienda.</p>
                                            <Link href="/business/register" className="text-blue-600 font-bold hover:underline">
                                                Completar registro
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Actions & Dashboard Link */}
                                <div className="space-y-6">
                                    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-gray-100 dark:border-neutral-800 shadow-xl shadow-blue-500/5">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                            Panel de Vendedor
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                                            Accede a todas las herramientas para administrar tus productos, pedidos y configuración.
                                        </p>

                                        <Link
                                            href="/seller"
                                            className="w-full py-4 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-3 group"
                                        >
                                            <BarChart3 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                            Ir al Dashboard
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                                            <div className="text-blue-600 dark:text-blue-400 font-bold text-lg mb-1">Estado</div>
                                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                Activo
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                                            <div className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-1">Plan</div>
                                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                                Estándar
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // GUEST / REGULAR USER VIEW (Original Landing)
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent dark:from-blue-900/20"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 animate-fade-in">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Nueva plataforma para vendedores
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-8 leading-tight animate-slide-up">
                            Vende tus productos en <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Bolsifyshop</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 animate-slide-up delay-100">
                            Llega a miles de clientes, gestiona tu tienda fácilmente y haz crecer tu negocio con nuestras herramientas profesionales.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-200">
                            <Link
                                href="/business/register"
                                className="px-8 py-4 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                Comenzar a Vender
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="#benefits"
                                className="px-8 py-4 text-lg font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-full transition-all"
                            >
                                Más Información
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Abstract Background Elements */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50 -z-10"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 -z-10"></div>
            </section>

            {/* Stats Section */}
            <section className="py-12 border-y border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">10k+</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Clientes Activos</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">500+</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Tiendas Registradas</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">98%</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Satisfacción</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">24/7</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Soporte Técnico</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-24 bg-white dark:bg-neutral-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Todo lo que necesitas para crecer
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Nuestra plataforma está diseñada para potenciar tu negocio con herramientas simples pero poderosas.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Mayor Visibilidad</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Tus productos aparecerán en nuestra página principal y en búsquedas relevantes, llegando a miles de compradores potenciales.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BarChart3 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Panel de Control</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Gestiona inventario, pedidos y analiza tus ventas con un panel de administración intuitivo y completo.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Pagos Seguros</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Procesamos los pagos de forma segura y transferimos tus ganancias directamente a tu cuenta bancaria.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gray-900 dark:bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        ¿Listo para escalar tu negocio?
                    </h2>
                    <p className="text-xl text-gray-300 mb-10">
                        Únete a la comunidad de vendedores exitosos en Bolsifyshop hoy mismo.
                    </p>
                    <Link
                        href="/business/register"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-600 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-all transform hover:scale-105"
                    >
                        Registrar mi Tienda
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
