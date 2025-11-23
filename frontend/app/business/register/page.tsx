'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Store, Mail, Lock, User, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/LoginModal';

import { sellerService } from '@/services/seller';

export default function SellerRegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const router = useRouter();
    const { login, user } = useAuth(); // Get user from context

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        store_name: '',
        store_description: ''
    });

    // Pre-fill name if user is logged in
    if (user && !formData.full_name) {
        setFormData(prev => ({ ...prev, full_name: user.full_name || '' }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (user) {
                // LOGGED IN USER: Register Store Only (Unified Account)
                await sellerService.registerStore({
                    name: formData.store_name,
                    description: formData.store_description
                });

                // Refresh user session to update role
                await login();

            } else {
                // NEW USER: Full Registration
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Las contraseñas no coinciden');
                }

                await sellerService.onboardSeller({
                    user: {
                        email: formData.email,
                        password: formData.password,
                        full_name: formData.full_name
                    },
                    store: {
                        name: formData.store_name,
                        description: formData.store_description
                    }
                });

                // Login with new credentials
                await login();
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex flex-col lg:flex-row font-sans">
            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white dark:bg-neutral-900 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="mx-auto w-full max-w-sm lg:w-96 relative z-10">
                    <div className="mb-8">
                        <Link href="/business" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors mb-6 group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Volver a Business
                        </Link>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            {user ? 'Completa tu Perfil de' : 'Crea tu cuenta de'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Vendedor</span>
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {user
                                ? `Hola ${user.full_name}, registra tu tienda para comenzar a vender.`
                                : 'Únete a miles de vendedores exitosos y empieza a vender hoy mismo.'}
                        </p>
                    </div>

                    <div className="mt-8">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-start gap-2 animate-shake">
                                    <div className="shrink-0 mt-0.5">⚠️</div>
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Only show user fields if NOT logged in */}
                                {!user && (
                                    <>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                id="full_name"
                                                name="full_name"
                                                type="text"
                                                required
                                                value={formData.full_name}
                                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl leading-5 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                                                placeholder="Nombre Completo"
                                            />
                                        </div>

                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl leading-5 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                                                placeholder="Correo Electrónico"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="relative group">
                                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        id="store_name"
                                        name="store_name"
                                        type="text"
                                        required
                                        value={formData.store_name}
                                        onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl leading-5 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                                        placeholder="Nombre de tu Tienda"
                                    />
                                </div>

                                {/* Only show password fields if NOT logged in */}
                                {!user && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                required
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl leading-5 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                                                placeholder="Contraseña"
                                            />
                                        </div>

                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                required
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl leading-5 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                                                placeholder="Confirmar"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-600/20 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {user ? 'Crear Tienda' : 'Registrar mi Tienda'}
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {!user && (
                            <div className="mt-8">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200 dark:border-neutral-700" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white dark:bg-neutral-900 text-gray-500">
                                            ¿Ya tienes una cuenta de vendedor?
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        onClick={() => setIsLoginModalOpen(true)}
                                        className="w-full flex justify-center items-center py-3 px-4 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-sm bg-white dark:bg-neutral-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all"
                                    >
                                        Iniciar Sesión
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Side - Image/Benefits */}
            <div className="hidden lg:block relative flex-1 bg-gray-900">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-900/80 mix-blend-multiply"></div>
                <div className="absolute inset-0 flex flex-col justify-center px-12 text-white z-10">
                    <div className="max-w-lg mx-auto">
                        <h3 className="text-4xl font-bold mb-8 leading-tight">
                            Lleva tu negocio al <br />
                            <span className="text-blue-400">siguiente nivel</span>
                        </h3>
                        <ul className="space-y-6">
                            {[
                                { title: 'Panel de Control Avanzado', desc: 'Gestiona inventario y pedidos en tiempo real.' },
                                { title: 'Pagos Seguros y Rápidos', desc: 'Recibe tus ganancias directamente en tu cuenta.' },
                                { title: 'Soporte Prioritario 24/7', desc: 'Equipo dedicado para ayudarte a crecer.' }
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-4">
                                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <CheckCircle className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold">{item.title}</h4>
                                        <p className="text-gray-300 text-sm">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                initialView="login"
            />
        </div>
    );
}
