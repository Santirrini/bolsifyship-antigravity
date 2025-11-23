'use client';

import { Home, Search, Heart, User, Menu } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useUI } from '@/context/UIContext';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function BottomNav() {
    const { openWishlist, openLoginModal } = useUI();
    const { user } = useAuth();
    const pathname = usePathname();
    // We can use this to toggle a mobile menu if needed, or just link to categories
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    const handleProfileClick = (e: React.MouseEvent) => {
        if (!user) {
            e.preventDefault();
            openLoginModal('login');
        }
    };

    const handleWishlistClick = () => {
        if (!user) {
            openLoginModal('login');
        } else {
            openWishlist();
        }
    };

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-t border-zinc-200 dark:border-neutral-800 pb-safe pt-2 px-6 z-50 transition-all duration-300">
            <div className="flex justify-between items-center max-w-md mx-auto">
                <Link
                    href="/"
                    className={`flex flex-col items-center justify-center w-16 h-14 gap-1 transition-colors duration-200 group
                        ${isActive('/') ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
                >
                    <Home className={`w-6 h-6 transition-transform duration-200 ${isActive('/') ? 'scale-110' : 'group-hover:scale-110'}`} strokeWidth={isActive('/') ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Inicio</span>
                </Link>

                <Link
                    href="/search"
                    className={`flex flex-col items-center justify-center w-16 h-14 gap-1 transition-colors duration-200 group
                        ${isActive('/search') ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
                >
                    <Search className={`w-6 h-6 transition-transform duration-200 ${isActive('/search') ? 'scale-110' : 'group-hover:scale-110'}`} strokeWidth={isActive('/search') ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Explorar</span>
                </Link>

                <button
                    onClick={handleWishlistClick}
                    className="flex flex-col items-center justify-center w-16 h-14 gap-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors duration-200 group"
                >
                    <Heart className="w-6 h-6 transition-transform duration-200 group-hover:scale-110 group-active:scale-95" strokeWidth={2} />
                    <span className="text-[10px] font-medium">Favoritos</span>
                </button>

                <Link
                    href="/profile"
                    onClick={handleProfileClick}
                    className={`flex flex-col items-center justify-center w-16 h-14 gap-1 transition-colors duration-200 group
                        ${isActive('/profile') ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
                >
                    <User className={`w-6 h-6 transition-transform duration-200 ${isActive('/profile') ? 'scale-110' : 'group-hover:scale-110'}`} strokeWidth={isActive('/profile') ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Perfil</span>
                </Link>
            </div>
        </div>
    );
}
