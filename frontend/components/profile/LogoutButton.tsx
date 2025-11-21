"use client";

import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const LogoutButton = () => {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <button
            className="w-full bg-white dark:bg-neutral-900 border border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-300 dark:hover:border-red-800 font-medium py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 group shadow-sm"
            onClick={handleLogout}
        >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Cerrar Sesión</span>
        </button>
    );
};

export default LogoutButton;
