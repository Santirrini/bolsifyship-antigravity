import React, { useState, useEffect } from 'react';
import { userService } from '@/services/user';
import { Package, ChevronRight } from 'lucide-react';

export default function OrderHistory() {
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await userService.getOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
            case 'shipped': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
            case 'processing': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
            case 'cancelled': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
            default: return 'text-neutral-600 bg-neutral-50 dark:bg-neutral-900/20';
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Historial de Pedidos</h2>

            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                        <Package className="mx-auto h-12 w-12 text-neutral-300" />
                        <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-white">No hay pedidos</h3>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Aún no has realizado ningún pedido.</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 transition-colors cursor-pointer">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-semibold text-neutral-900 dark:text-white">Pedido #{order.id}</span>
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Total</p>
                                        <p className="font-semibold text-neutral-900 dark:text-white">${order.total_amount.toFixed(2)}</p>
                                    </div>
                                    <ChevronRight className="text-neutral-400" size={20} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
