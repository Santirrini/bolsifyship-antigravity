'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, Store, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function UserMenu() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!user) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-neutral-800 transition-all duration-200 group"
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-100 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center border border-zinc-200 dark:border-neutral-700 group-hover:border-blue-500/30 transition-colors">
                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {user.full_name ? user.full_name[0].toUpperCase() : user.email[0].toUpperCase()}
                    </span>
                </div>
                <div className="flex flex-col items-start text-left hidden sm:flex">
                    <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {user.full_name?.split(' ')[0] || 'Usuario'}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-neutral-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">

                    {/* Header */}
                    <div className="p-4 border-b border-zinc-100 dark:border-neutral-800 bg-zinc-50/50 dark:bg-neutral-900/50">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                            {user.full_name || 'Usuario'}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                            {user.email}
                        </p>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 flex flex-col gap-1">
                        <Link
                            href="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                        >
                            <User className="w-4 h-4 text-zinc-500" />
                            Mi Perfil
                        </Link>

                        {user.role === 'seller' && (
                            <Link
                                href="/seller"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                            >
                                <LayoutDashboard className="w-4 h-4 text-blue-500" />
                                Panel de Vendedor
                            </Link>
                        )}

                        <div className="h-px bg-zinc-100 dark:bg-neutral-800 my-1" />

                        <button
                            onClick={() => {
                                logout();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
