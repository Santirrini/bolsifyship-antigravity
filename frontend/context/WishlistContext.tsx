'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { userService } from '@/services/user';

export interface WishlistItem {
    id: number;
    name: string;
    price: number;
    image: string;
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: number) => void;
    isInWishlist: (id: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        // Load user and wishlist from backend
        const loadUserAndWishlist = async () => {
            try {
                const user = await userService.getProfile();
                if (user && user.id) {
                    setUserId(user.id);
                    // Load wishlist from localStorage as fallback
                    const saved = localStorage.getItem('wishlist');
                    if (saved) {
                        try {
                            setWishlist(JSON.parse(saved));
                        } catch (e) {
                            console.error("Failed to parse wishlist", e);
                        }
                    }
                }
            } catch (error) {
                // User not logged in, use localStorage only
                const saved = localStorage.getItem('wishlist');
                if (saved) {
                    try {
                        setWishlist(JSON.parse(saved));
                    } catch (e) {
                        console.error("Failed to parse wishlist", e);
                    }
                }
            }
        };
        loadUserAndWishlist();
    }, []);

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = async (item: WishlistItem) => {
        setWishlist((prev) => {
            if (prev.some((i) => i.id === item.id)) {
                toast.info(`${item.name} is already in your wishlist`);
                return prev;
            }
            toast.success(`Added ${item.name} to wishlist`);

            // Sync with backend if user is logged in
            if (userId) {
                userService.toggleWishlist(userId, item.id).catch((error) => {
                    console.error('Error syncing wishlist with backend:', error);
                });
            }

            return [...prev, item];
        });
    };

    const removeFromWishlist = async (id: number) => {
        setWishlist((prev) => prev.filter((item) => item.id !== id));
        toast.info("Removed from wishlist");

        // Sync with backend if user is logged in
        if (userId) {
            userService.toggleWishlist(userId, id).catch((error) => {
                console.error('Error syncing wishlist removal with backend:', error);
            });
        }
    };

    const isInWishlist = (id: number) => wishlist.some((item) => item.id === id);

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
