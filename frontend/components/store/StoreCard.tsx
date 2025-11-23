import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Clock, MessageCircle, UserPlus, Check } from 'lucide-react';
import { Store, MOCK_PRODUCTS, storeService } from '@/services/store';
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

    // Mock top products for preview (in a real app, these would come from the API)
    // In a real scenario, we might want to fetch these or have them included in the store object
    const topProducts = MOCK_PRODUCTS.slice(0, 3);

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
        <Link href={`/stores/${store.id}`} className="group block bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:border-blue-100 dark:hover:border-blue-900/30 transition-all duration-300 hover:-translate-y-1">
            {/* Banner */}
            <div className="relative h-32 bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                {store.banner_url ? (
                    <Image
                        src={store.banner_url}
                        alt={`${store.name} banner`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
            </div>

            {/* Content */}
            <div className="px-5 pb-5 relative">
                {/* Logo & Header */}
                <div className="flex justify-between items-end -mt-12 mb-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-4 border-white dark:border-neutral-900 shadow-lg bg-white dark:bg-neutral-800">
                        <Image
                            src={store.logo_url || `https://ui-avatars.com/api/?name=${store.name}`}
                            alt={store.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <button
                        className={`mb-1 flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full shadow-sm transition-all duration-200 ${isFollowing
                                ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/25'
                            }`}
                        onClick={handleFollow}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : isFollowing ? (
                            <>
                                <Check className="w-3.5 h-3.5" />
                                Siguiendo
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-3.5 h-3.5" />
                                Seguir
                            </>
                        )}
                    </button>
                </div>

                {/* Store Info */}
                <div className="mb-5">
                    <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                            {store.name}
                        </h3>
                        <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 font-medium">{store.category || 'General Store'}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-neutral-800/50 rounded-xl p-3 border border-gray-100 dark:border-neutral-800">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span>5 años</span>
                    </div>
                    <div className="w-px h-3 bg-gray-200 dark:bg-neutral-700" />
                    <div className="flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-green-500" />
                        <span>{store.response_rate || 98}% Respuestas</span>
                    </div>
                </div>

                {/* Product Preview */}
                <div className="grid grid-cols-3 gap-2">
                    {topProducts.map((product) => (
                        <div key={product.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default StoreCard;
