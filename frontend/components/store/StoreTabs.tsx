'use client';

import { useState } from 'react';

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
        <div className="border-b border-gray-200 dark:border-neutral-800 mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}
