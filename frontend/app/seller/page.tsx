"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, Package, ShoppingBag, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";

interface Stats {
    total_sales: number;
    total_orders: number;
    total_products: number;
}

export default function SellerDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/seller/stats");
                setStats(response.data);
            } catch (error: any) {
                console.error("Error fetching stats:", error);
                if (error.response && error.response.status === 404) {
                    // Store not found, redirect to settings to create one
                    router.push('/seller/settings');
                    return;
                }
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No tienes una tienda activa</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Necesitas crear una tienda para ver las estadísticas.</p>
                <a href="/seller/settings" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                    Crear Tienda
                </a>
            </div>
        );
    }

    const statCards = [
        {
            title: "Ventas Totales",
            value: `$${stats.total_sales.toFixed(2)}`,
            icon: DollarSign,
            gradient: "from-green-500 to-emerald-600",
            trend: "+12.5%",
            trendUp: true,
        },
        {
            title: "Pedidos",
            value: stats.total_orders,
            icon: ShoppingBag,
            gradient: "from-blue-500 to-indigo-600",
            trend: "+4.3%",
            trendUp: true,
        },
        {
            title: "Productos",
            value: stats.total_products,
            icon: Package,
            gradient: "from-purple-500 to-violet-600",
            trend: "0%",
            trendUp: true,
        },
        {
            title: "Rendimiento",
            value: "98%", // Mock value
            icon: TrendingUp,
            gradient: "from-orange-500 to-amber-600",
            trend: "-1.2%",
            trendUp: false,
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Bienvenido de nuevo, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user?.full_name}</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500`}></div>

                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient} text-white shadow-lg shadow-indigo-500/20`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            {stat.trend && (
                                <div className={`flex items-center text-sm font-medium ${stat.trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {stat.trendUp ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                                    {stat.trend}
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Actividad Reciente</h3>
                    <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">Ver todo</button>
                </div>
                <div className="p-6 text-center text-gray-500 dark:text-gray-400 py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                        <TrendingUp className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p>No hay actividad reciente para mostrar.</p>
                    <p className="text-sm mt-1">Tus ventas y pedidos recientes aparecerán aquí.</p>
                </div>
            </div>
        </div>
    );
}
