"use client";

import { useEffect, useState } from "react";
import {
    DollarSign,
    ShoppingBag,
    Users,
    Package,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Activity
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
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    const cards = [
        {
            title: "Total Sales",
            value: stats ? `$${stats.total_sales.toFixed(2)}` : "$0.00",
            icon: DollarSign,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            trend: "+12.5%",
            trendUp: true
        },
        {
            title: "Total Orders",
            value: stats ? stats.total_orders : 0,
            icon: ShoppingBag,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            trend: "+8.2%",
            trendUp: true
        },
        {
            title: "Total Users",
            value: stats ? stats.total_users : 0,
            icon: Users,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
            trend: "+24.3%",
            trendUp: true
        },
        {
            title: "Total Products",
            value: stats ? stats.total_products : 0,
            icon: Package,
            color: "text-orange-400",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20",
            trend: "-2.1%",
            trendUp: false
        },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
                    <p className="text-gray-400 mt-2">Welcome back to your store administration.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:border-gray-700 transition-colors">
                        Last 7 Days
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20">
                        Download Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div key={index} className={`bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border ${card.border} hover:border-opacity-50 transition-all duration-300 group`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${card.bg} group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className={`w-6 h-6 ${card.color}`} />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${card.trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {card.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {card.trend}
                                </div>
                            </div>
                            <h3 className="text-gray-400 text-sm font-medium">{card.title}</h3>
                            <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-purple-500" />
                            Revenue Analytics
                        </h3>
                        <select className="bg-gray-950 border border-gray-800 text-gray-400 text-sm rounded-lg px-3 py-1 outline-none focus:border-purple-500">
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-800 rounded-xl bg-gray-950/50">
                        <div className="text-center">
                            <TrendingUp className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">Chart Visualization Placeholder</p>
                            <p className="text-gray-600 text-sm mt-1">Connect a charting library to visualize data</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity / Notifications */}
                <div className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-800">
                    <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-2 h-2 mt-2 rounded-full bg-purple-500 shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-300">New order #123{i} received</p>
                                    <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-sm text-purple-400 hover:text-purple-300 font-medium border border-purple-500/20 hover:bg-purple-500/10 rounded-lg transition-all">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    );
}
