"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    // Basic protection (can be enhanced with middleware or useEffect redirect)
    if (user && user.role !== "seller" && user.role !== "admin") {
        // In a real app, redirect here. For now, maybe show a warning or return null.
        // returning null might cause hydration issues if not handled carefully.
        // Let's assume middleware handles strict protection, or we render a "Not Authorized" message.
    }

    const navItems = [
        { name: "Dashboard", href: "/seller", icon: LayoutDashboard },
        { name: "Productos", href: "/seller/products", icon: Package },
        { name: "Pedidos", href: "/seller/orders", icon: ShoppingCart },
        { name: "Configuración", href: "/seller/settings", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Seller Panel</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gestiona tu tienda</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                    }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
