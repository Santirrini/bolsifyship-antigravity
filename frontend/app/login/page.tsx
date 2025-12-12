'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { authService } from '@/services/auth';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('username', email); // dj-rest-auth standard login often uses 'username' field even for email
            formData.append('password', password);
            // If backend is configured for email login, this might still be 'username' key or 'email' key. 
            // Standard django-rest-auth uses 'username' or configures it. 
            // Let's assume 'username' for now as per previous code, but check if email is needed.

            await authService.login(formData);
            await login(); // Context update
        } catch (err) {
            console.error(err);
            setError('Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="max-w-md w-full space-y-8 relative">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full -ml-10 -mb-10 blur-2xl -z-10"></div>

                <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl p-8 sm:p-10 border border-gray-100 dark:border-neutral-800 backdrop-blur-sm">
                    <div className="text-center mb-8">
                        <div className="mx-auto h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
                            <Lock className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Sign in to access your account
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">
                                    {error}
                                </p>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        Sign in
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Don't have an account?{' '}
                                <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                    Sign up now
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="text-center">
                    <p className="text-xs text-gray-400 dark:text-neutral-500">
                        &copy; 2024 Bolsifyshop. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
