'use client';

import { motion } from 'framer-motion';

interface Tab {
    id: string;
    label: string;
}

interface StoreTabsProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export default function StoreTabs({ activeTab, onTabChange }: StoreTabsProps) {
    const tabs: Tab[] = [
        { id: 'home', label: 'Home' },
        { id: 'products', label: 'All Products' },
        { id: 'about', label: 'About' },
        { id: 'reviews', label: 'Reviews' },
    ];

    return (
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                relative whitespace-nowrap py-4 px-1 font-medium text-sm transition-colors
                                ${activeTab === tab.id
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }
                            `}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}
