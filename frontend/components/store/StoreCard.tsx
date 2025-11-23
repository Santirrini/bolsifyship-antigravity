import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Clock, MessageCircle, UserPlus, Check, Star } from 'lucide-react';
import { Store, storeService } from '@/services/store';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface StoreCardProps {
    store: Store;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
    const { user } = useAuth();
    const router = useRouter();
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Use real top_products if available, otherwise fallback to empty array
    const topProducts = store.top_products || [];

    useEffect(() => {
        if (user) {
            checkFollowStatus();
        }
    }, [user, store.id]);

    const checkFollowStatus = async () => {
        const following = await storeService.checkIsFollowing(store.id);
        setIsFollowing(following);
    };

    const handleFollow = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            router.push('/login');
            return;
        }

        setIsLoading(true);
        try {
            if (isFollowing) {
                await storeService.unfollowStore(store.id);
                setIsFollowing(false);
            } else {
                await storeService.followStore(store.id);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("Failed to toggle follow status", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Link href={`/store/${store.id}`} className="group block bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-neutral-800 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1">
            {/* Banner */}
            <div className="relative h-28 bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                {store.banner_url ? (
                    <Image
                        src={store.banner_url}
                        alt={`${store.name} banner`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-neutral-800 dark:to-neutral-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="px-4 pb-4 relative">
                {/* Header with Logo and Follow Button */}
                <div className="flex justify-between items-end -mt-10 mb-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border-[3px] border-white dark:border-neutral-900 shadow-md bg-white dark:bg-neutral-800">
                        <Image
                            src={store.logo_url || `https://ui-avatars.com/api/?name=${store.name}&background=random`}
                            alt={store.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <button
                        className={`mb-1 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${isFollowing
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30'
                            }`}
                        onClick={handleFollow}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : isFollowing ? (
                            <>
                                <Check className="w-3 h-3" />
                                Siguiendo
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-3 h-3" />
                                Seguir
                            </>
                        )}
                    </button>
                </div>

                {/* Store Info */}
                <div className="mb-4">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                            {store.name}
                        </h3>
                        <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">{store.category || 'General Store'}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-neutral-700" />
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span>{store.rating || 'Nuevo'}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-neutral-800/50 border border-gray-100 dark:border-neutral-800">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Antigüedad</span>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">5 años</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-neutral-800/50 border border-gray-100 dark:border-neutral-800">
                        <MessageCircle className="w-3.5 h-3.5 text-green-500" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Respuestas</span>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{store.response_rate || 98}%</span>
                        </div>
                    </div>
                </div>

                {/* Product Preview */}
                {topProducts.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                        {topProducts.map((product: any) => (
                            <div key={product.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-800">
                                <Image
                                    src={product.image || product.images?.[0] || '/placeholder.png'}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-16 bg-gray-50 dark:bg-neutral-800/30 rounded-lg border border-dashed border-gray-200 dark:border-neutral-800">
                        <span className="text-xs text-gray-400">Sin productos destacados</span>
                    </div>
                )}
            </div>
        </Link>
    );
};

export default StoreCard;
