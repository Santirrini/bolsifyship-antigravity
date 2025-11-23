'use client';

import Link from 'next/link';
import { ChevronRight, Home, ChevronLeft } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    // Get the parent category (second to last item) or default to home
    const parent = items.length > 1 ? items[items.length - 2] : { label: 'Home', href: '/' };

    return (
        <nav aria-label="Breadcrumb">
            {/* Mobile View: Simple Back Link */}
            <div className="flex md:hidden">
                <Link
                    href={parent.href}
                    className="flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
                    {parent.label}
                </Link>
            </div>

            {/* Desktop View: Full Breadcrumbs */}
            <ol className="hidden md:flex items-center space-x-2">
                <li>
                    <div>
                        <Link href="/" className="text-zinc-400 hover:text-zinc-500 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
                            <Home className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </div>
                </li>
                {items.map((item, index) => (
                    <li key={item.href}>
                        <div className="flex items-center">
                            <ChevronRight className="h-4 w-4 flex-shrink-0 text-zinc-300 dark:text-zinc-600" aria-hidden="true" />
                            <Link
                                href={item.href}
                                className={`ml-2 text-sm font-medium transition-colors ${index === items.length - 1
                                    ? 'text-zinc-900 dark:text-white pointer-events-none'
                                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                                    }`}
                                aria-current={index === items.length - 1 ? 'page' : undefined}
                            >
                                {item.label}
                            </Link>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
