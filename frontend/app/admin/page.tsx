"use client";

import { useEffect, useState } from "react";
import {
    DollarSign,
    ShoppingBag,
    Users,
    Package
} from "lucide-react";

interface Stats {
    total_sales: number;
    total_orders: number;
    total_users: number;
    total_products: number;
}

import { adminService } from "@/services/admin";

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getStats();
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="text-white">Loading stats...</div>;
    }

    const cards = [
        {
            title: "Total Sales",
            value: stats ? `$${stats.total_sales.toFixed(2)}` : "$0.00",
            icon: DollarSign,
            color: "text-green-400",
            bg: "bg-green-400/10",
        },
        {
            title: "Total Orders",
            value: stats ? stats.total_orders : 0,
            icon: ShoppingBag,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
        },
        {
            title: "Total Users",
            value: stats ? stats.total_users : 0,
            icon: Users,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
        },
        {
            title: "Total Products",
            value: stats ? stats.total_products : 0,
            icon: Package,
            color: "text-orange-400",
            bg: "bg-orange-400/10",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
                <p className="text-gray-400 mt-2">Welcome back to your store administration.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div key={index} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${card.bg}`}>
                                    <Icon className={`w-6 h-6 ${card.color}`} />
                                </div>
                                <span className="text-xs font-medium text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                                    +2.5%
                                </span>
                            </div>
                            <h3 className="text-gray-400 text-sm font-medium">{card.title}</h3>
                            <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Placeholder for Charts or Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-80 flex items-center justify-center text-gray-500">
                    Sales Chart Placeholder
                </div>
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-80 flex items-center justify-center text-gray-500">
                    Recent Orders Placeholder
                </div>
            </div>
        </div>
    );
}
