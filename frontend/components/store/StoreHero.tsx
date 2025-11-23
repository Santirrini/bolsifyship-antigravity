'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, UserPlus, UserCheck, MessageCircle, Star, Award, Calendar } from 'lucide-react';
import { storeService } from '@/services/store';
import { toast } from 'sonner';

interface StoreHeroProps {
    store: {
        id: number;
        name: string;
        description?: string;
        logo_url?: string;
        banner_url?: string;
        created_at?: string;
        rating?: number;
        response_rate?: number;
    };
}

export default function StoreHero({ store }: StoreHeroProps) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoadingFollow, setIsLoadingFollow] = useState(false);

    useEffect(() => {
        const checkFollowStatus = async () => {
            if (store.id) {
                const following = await storeService.checkIsFollowing(store.id);
                setIsFollowing(following);
            }
        };
        checkFollowStatus();
    }, [store.id]);

    const handleFollowToggle = async () => {
        setIsLoadingFollow(true);
        try {
            if (isFollowing) {
                await storeService.unfollowStore(store.id);
                setIsFollowing(false);
                toast.success(`Unfollowed ${store.name}`);
            } else {
                await storeService.followStore(store.id);
                setIsFollowing(true);
                toast.success(`Following ${store.name}`);
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
            toast.error('Failed to update follow status. Please try again.');
        } finally {
            setIsLoadingFollow(false);
        }
    };

    const yearsActive = store.created_at
        ? new Date().getFullYear() - new Date(store.created_at).getFullYear()
        : 0;

    return (
        <div className="relative mb-4 group">
            {/* Banner Background */}
            <div className="h-64 w-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden relative">
                {store.banner_url ? (
                    <img
                        src={store.banner_url}
                        alt={`${store.name} banner`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 opacity-90" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20">
                <div className="flex flex-col md:flex-row items-end gap-6">
                    {/* Floating Logo */}
                    <div className="relative z-10">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border-4 border-white dark:border-neutral-950 overflow-hidden flex items-center justify-center relative group/logo">
                            {store.logo_url ? (
                                <img
                                    src={store.logo_url}
                                    alt={store.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-4xl font-bold text-neutral-400">
                                    {store.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Store Info */}
                    <div className="flex-1 pb-4 w-full md:w-auto">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white drop-shadow-sm md:drop-shadow-none md:text-white md:dark:text-white mix-blend-normal">
                                        {store.name}
                                    </h1>
                                    <CheckCircle className="w-6 h-6 text-blue-500 fill-blue-500 text-white" />
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 md:text-gray-200 text-sm md:text-base max-w-2xl line-clamp-1 mb-3">
                                    {store.description || "Welcome to our official store."}
                                </p>

                                {/* Metrics */}
                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gray-700 dark:text-gray-200 md:text-white">
                                        <Calendar className="w-4 h-4" />
                                        <span className="font-medium">{yearsActive > 0 ? `${yearsActive} Years` : 'New Seller'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gray-700 dark:text-gray-200 md:text-white">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="font-medium">{store.rating || '4.8'} Rating</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gray-700 dark:text-gray-200 md:text-white">
                                        <Award className="w-4 h-4 text-green-400" />
                                        <span className="font-medium">{store.response_rate || '98'}% Positive</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-2 md:mt-0">
                                <button
                                    onClick={handleFollowToggle}
                                    disabled={isLoadingFollow}
                                    className={`
                                        flex-1 md:flex-none px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg
                                        ${isFollowing
                                            ? 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 dark:bg-neutral-800 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/25'
                                        }
                                    `}
                                >
                                    {isLoadingFollow ? (
                                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : isFollowing ? (
                                        <>
                                            <UserCheck className="w-4 h-4" />
                                            Following
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4" />
                                            Follow
                                        </>
                                    )}
                                </button>
                                <button className="flex-1 md:flex-none px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-gray-900 dark:text-white md:text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg">
                                    <MessageCircle className="w-4 h-4" />
                                    Contact
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
