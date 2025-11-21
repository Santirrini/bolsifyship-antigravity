'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    isWishlistOpen: boolean;
    openWishlist: () => void;
    closeWishlist: () => void;
    toggleWishlist: () => void;
    isLoginOpen: boolean;
    authView: 'login' | 'register';
    openLoginModal: (view?: 'login' | 'register') => void;
    closeLoginModal: () => void;
    setAuthView: (view: 'login' | 'register') => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [authView, setAuthView] = useState<'login' | 'register'>('login');

    const openCart = () => {
        setIsCartOpen(true);
        setIsWishlistOpen(false); // Close wishlist if open
    };
    const closeCart = () => setIsCartOpen(false);
    const toggleCart = () => {
        if (isCartOpen) closeCart();
        else openCart();
    };

    const openWishlist = () => {
        setIsWishlistOpen(true);
        setIsCartOpen(false); // Close cart if open
    };
    const closeWishlist = () => setIsWishlistOpen(false);
    const toggleWishlist = () => {
        if (isWishlistOpen) closeWishlist();
        else openWishlist();
    };

    const openLoginModal = (view: 'login' | 'register' = 'login') => {
        setAuthView(view);
        setIsLoginOpen(true);
        setIsCartOpen(false);
        setIsWishlistOpen(false);
    };

    const closeLoginModal = () => setIsLoginOpen(false);

    return (
        <UIContext.Provider
            value={{
                isCartOpen,
                openCart,
                closeCart,
                toggleCart,
                isWishlistOpen,
                openWishlist,
                closeWishlist,
                toggleWishlist,
                isLoginOpen,
                authView,
                openLoginModal,
                closeLoginModal,
                setAuthView,
            }}
        >
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}
