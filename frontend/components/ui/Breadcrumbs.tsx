'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
                <li>
                    <div>
                        <Link href="/" className="text-gray-400 hover:text-gray-500">
                            <Home className="h-5 w-5" aria-hidden="true" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </div>
                </li>
                {items.map((item, index) => (
                    <li key={item.href}>
                        <div className="flex items-center">
                            <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-300" aria-hidden="true" />
                            <Link
                                href={item.href}
                                className={`ml-2 text-sm font-medium ${index === items.length - 1
                                        ? 'text-gray-900 pointer-events-none'
                                        : 'text-gray-500 hover:text-gray-700'
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
