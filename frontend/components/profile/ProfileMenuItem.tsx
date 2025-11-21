"use client";

import React from 'react';
import { ChevronRight, LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface ProfileMenuItemProps {
    icon: LucideIcon;
    label: string;
    href?: string;
    onClick?: () => void;
    isPro?: boolean;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({ icon: Icon, label, href, onClick, isPro }) => {
    const content = (
        <div className="flex items-center justify-between w-full p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200 cursor-pointer group active:scale-[0.99]">
            <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                    <Icon className="w-5 h-5 text-neutral-500 dark:text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>
                <span className="text-neutral-700 dark:text-neutral-200 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                    {label}
                </span>
                {isPro && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        PRO
                    </span>
                )}
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-transform group-hover:translate-x-1" />
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                {content}
            </Link>
        );
    }

    return (
        <div onClick={onClick} className="border-b border-neutral-100 dark:border-neutral-800 last:border-0">
            {content}
        </div>
    );
};

export default ProfileMenuItem;
