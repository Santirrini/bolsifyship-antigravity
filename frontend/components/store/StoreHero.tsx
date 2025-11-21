import { CheckCircle } from 'lucide-react';

interface StoreHeroProps {
    store: {
        name: string;
        description?: string;
        logo_url?: string;
        created_at?: string;
    };
}

export default function StoreHero({ store }: StoreHeroProps) {
    const yearsActive = store.created_at
        ? new Date().getFullYear() - new Date(store.created_at).getFullYear()
        : 0;

    return (
        <div className="relative mb-8">
            {/* Banner Background - Solid Color or Desaturated Image */}
            <div className="h-48 w-full bg-slate-100 dark:bg-neutral-800 overflow-hidden">
                {/* Optional: Add a subtle pattern or gradient here */}
                <div className="w-full h-full bg-gradient-to-r from-slate-200 to-slate-100 dark:from-neutral-800 dark:to-neutral-900 opacity-50" />
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                    {/* Floating Logo */}
                    <div className="relative">
                        <div className="w-32 h-32 rounded-xl bg-white dark:bg-neutral-900 shadow-lg border-4 border-white dark:border-neutral-900 overflow-hidden flex items-center justify-center">
                            {store.logo_url ? (
                                <img
                                    src={store.logo_url}
                                    alt={store.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-4xl font-bold text-slate-300 dark:text-neutral-700">
                                    {store.name.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Store Info */}
                    <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {store.name}
                            </h1>
                            {/* Verification Badge */}
                            <CheckCircle className="w-6 h-6 text-blue-500 fill-blue-500 text-white" />
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            {/* Metrics */}
                            <div className="flex items-center gap-1">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {yearsActive > 0 ? yearsActive : 1}
                                </span>
                                <span>Years selling</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                            <div className="flex items-center gap-1">
                                <span className="font-semibold text-gray-900 dark:text-white">4.8</span>
                                <span>Rating</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                            <div className="flex items-center gap-1">
                                <span className="font-semibold text-gray-900 dark:text-white">98%</span>
                                <span>Positive Feedback</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons (Optional) */}
                    <div className="pb-2 flex gap-3">
                        <button className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                            Follow
                        </button>
                        <button className="px-6 py-2 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                            Contact
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
