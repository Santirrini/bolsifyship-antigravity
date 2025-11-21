'use client';

import { Home, Compass, Heart, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useUI } from '@/context/UIContext';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
    const { openWishlist, openLoginModal } = useUI();
    const { user } = useAuth();
    const pathname = usePathname();

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
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 py-2 px-6 flex justify-between items-center z-50 pb-safe">
            <Link href="/" className={`flex flex-col items-center cursor-pointer transition-colors ${isActive('/') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
                <Home className="w-6 h-6" />
                <span className="text-xs mt-1">Inicio</span>
            </Link>
            <Link href="/search" className={`flex flex-col items-center cursor-pointer transition-colors ${isActive('/search') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
                <Compass className="w-6 h-6" />
                <span className="text-xs mt-1">Explorar</span>
            </Link>
            <button onClick={handleWishlistClick} className="flex flex-col items-center text-gray-500 hover:text-blue-600 cursor-pointer transition-colors">
                <Heart className="w-6 h-6" />
                <span className="text-xs mt-1">Favoritos</span>
            </button>
            <Link
                href="/profile"
                onClick={handleProfileClick}
                className={`flex flex-col items-center cursor-pointer transition-colors ${isActive('/profile') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
            >
                <User className="w-6 h-6" />
                <span className="text-xs mt-1">Perfil</span>
            </Link>
        </div>
    );
}
