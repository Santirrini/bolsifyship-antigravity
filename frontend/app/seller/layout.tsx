"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import SellerSidebar from "@/components/seller/SellerSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <ProtectedRoute allowedRoles={['seller', 'admin']}>
            <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
                <SellerSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* Mobile Header */}
                    <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                        <h1 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Seller Panel</h1>
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    <main className="flex-1 overflow-y-auto p-4 md:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
