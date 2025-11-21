'use client';

import { X, CheckCircle, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialView?: 'login' | 'register';
}

export default function LoginModal({ isOpen, onClose, initialView = 'login' }: LoginModalProps) {
    const [view, setView] = useState<'login' | 'register'>(initialView);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            setView(initialView);
            setError('');
            setFormData({ email: '', password: '', full_name: '', confirmPassword: '' });
        }
    }, [isOpen, initialView]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (view === 'login') {
                const formDataLogin = new FormData();
                formDataLogin.append('username', formData.email);
                formDataLogin.append('password', formData.password);

                const res = await fetch('http://localhost:8000/auth/token', {
                    method: 'POST',
                    body: formDataLogin,
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.detail || 'Error al iniciar sesión');
                }

                const data = await res.json();
                await login(data.access_token);
                onClose();
            } else {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Las contraseñas no coinciden');
                }

                const res = await fetch('http://localhost:8000/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                        full_name: formData.full_name,
                    }),
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.detail || 'Error al registrarse');
                }

                // Auto login after register
                const formDataLogin = new FormData();
                formDataLogin.append('username', formData.email);
                formDataLogin.append('password', formData.password);

                const loginRes = await fetch('http://localhost:8000/auth/token', {
                    method: 'POST',
                    body: formDataLogin,
                });

                if (loginRes.ok) {
                    const loginData = await loginRes.json();
                    await login(loginData.access_token);
                    onClose();
                } else {
                    setView('login');
                    setError('Registro exitoso. Por favor inicia sesión.');
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Placeholder for Google Login
        alert("Google Login integration requires Google Cloud credentials.");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row relative animate-scale-in border border-gray-100 dark:border-neutral-800">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>

                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center relative z-10 bg-white dark:bg-neutral-900">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            Bolsifyshop
                        </h2>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                            {view === 'login' ? 'Bienvenido de Nuevo' : 'Crea tu Cuenta'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {view === 'login'
                                ? 'Ingresa tus datos para acceder a tu cuenta'
                                : 'Únete a nosotros y disfruta de las mejores ofertas'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {view === 'register' && (
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Nombre Completo"
                                    required
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full pl-10 p-3 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400"
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="email"
                                placeholder="Correo Electrónico"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-10 p-3 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400"
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-10 p-3 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400"
                            />
                        </div>

                        {view === 'register' && (
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="Confirmar Contraseña"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full pl-10 p-3 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400"
                                />
                            </div>
                        )}

                        {view === 'login' && (
                            <div className="text-right">
                                <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {view === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-neutral-700"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-neutral-900 px-2 text-gray-400">o continúa con</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleGoogleLogin}
                            className="flex items-center justify-center gap-2 p-3 border border-gray-200 dark:border-neutral-700 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 p-3 border border-gray-200 dark:border-neutral-700 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300">
                            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5" />
                            Facebook
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {view === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                            <button
                                onClick={() => setView(view === 'login' ? 'register' : 'login')}
                                className="ml-2 text-blue-600 font-bold hover:underline focus:outline-none"
                            >
                                {view === 'login' ? 'Regístrate aquí' : 'Inicia Sesión'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Right Side - Benefits */}
                <div className="hidden md:flex w-1/2 bg-gray-50 dark:bg-neutral-800 p-12 flex-col justify-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                            {view === 'login' ? 'Bienvenido de vuelta a' : 'Únete a la comunidad de'} <br />
                            <span className="text-blue-600">Bolsifyshop</span>
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 group">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full shrink-0 group-hover:scale-110 transition-transform">
                                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">Ofertas Exclusivas</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Acceso anticipado a descuentos y promociones especiales.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 group">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full shrink-0 group-hover:scale-110 transition-transform">
                                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">Seguimiento de Pedidos</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Rastrea tus compras en tiempo real desde tu perfil.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 group">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full shrink-0 group-hover:scale-110 transition-transform">
                                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">Lista de Deseos</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Guarda tus productos favoritos y recibe alertas de precio.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Background Elements */}
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50 animate-pulse delay-700"></div>
                </div>
            </div>
        </div>
    );
}
