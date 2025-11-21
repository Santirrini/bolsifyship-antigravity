"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, Package, ShoppingBag, TrendingUp } from "lucide-react";
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

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/seller/stats");
                setStats(response.data);
            } catch (error: any) {
                console.error("Error fetching stats:", error);
                if (error.response && error.response.status === 404) {
                    setStats(null);
                }
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user]);

    if (loading) {
        return <div className="flex justify-center items-center h-64">Cargando estadísticas...</div>;
    }

    if (!stats) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No tienes una tienda activa</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Necesitas crear una tienda para ver las estadísticas.</p>
                <a href="/seller/settings" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
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
            color: "bg-green-500",
        },
        {
            title: "Pedidos",
            value: stats.total_orders,
            icon: ShoppingBag,
            color: "bg-blue-500",
        },
        {
            title: "Productos",
            value: stats.total_products,
            icon: Package,
            color: "bg-purple-500",
        },
        {
            title: "Rendimiento",
            value: "+12%", // Mock value for now
            icon: TrendingUp,
            color: "bg-orange-500",
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                <p className="text-gray-500 dark:text-gray-400">Bienvenido de nuevo, {user?.full_name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity or Charts could go here */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actividad Reciente</h3>
                <p className="text-gray-500 dark:text-gray-400">No hay actividad reciente para mostrar.</p>
            </div>
        </div>
    );
}
