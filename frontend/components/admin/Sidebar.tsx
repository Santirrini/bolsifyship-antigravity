"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    LogOut
} from "lucide-react";

const Sidebar = () => {
    const pathname = usePathname();

    const links = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Products", href: "/admin/products", icon: Package },
        { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
        { name: "Users", href: "/admin/users", icon: Users },
        // { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="flex flex-col w-64 bg-gray-900 h-screen text-white border-r border-gray-800">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    Bolsify Admin
                </h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-gray-800">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-xl transition-all duration-200">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
