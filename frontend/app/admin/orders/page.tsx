"use client";

import { useEffect, useState } from "react";
import { Search, Eye, CheckCircle, XCircle, Truck, Clock } from "lucide-react";

interface Order {
    id: number;
    user_id: number;
    total_amount: number;
    status: string;
    created_at: string;
    shipping_address: string;
}

import { adminService } from "@/services/admin";

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await adminService.getOrders();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            await adminService.updateOrderStatus(id, newStatus);
            setOrders(orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
        } catch (error) {
            console.error("Error updating order:", error);
            alert("Failed to update order status");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "delivered":
                return "bg-green-500/20 text-green-400";
            case "shipped":
                return "bg-blue-500/20 text-blue-400";
            case "processing":
                return "bg-yellow-500/20 text-yellow-400";
            case "cancelled":
                return "bg-red-500/20 text-red-400";
            default:
                return "bg-gray-500/20 text-gray-400";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case "delivered":
                return CheckCircle;
            case "shipped":
                return Truck;
            case "processing":
                return Clock;
            case "cancelled":
                return XCircle;
            default:
                return Clock;
        }
    };

    const filteredOrders = orders.filter((order) =>
        order.id.toString().includes(searchTerm) ||
        order.shipping_address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Orders</h2>
                <p className="text-gray-400 mt-1">Manage customer orders</p>
            </div>

            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-800">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-400">
                        <thead className="bg-gray-800 text-gray-300 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center">
                                        Loading orders...
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => {
                                    const StatusIcon = getStatusIcon(order.status);
                                    return (
                                        <tr key={order.id} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">#{order.id}</td>
                                            <td className="px-6 py-4">{order.created_at || "N/A"}</td>
                                            <td className="px-6 py-4">User #{order.user_id}</td>
                                            <td className="px-6 py-4 text-white">${order.total_amount?.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    <span className="capitalize">{order.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    className="bg-gray-800 text-white text-sm border border-gray-700 rounded-lg px-2 py-1 focus:outline-none focus:border-purple-500"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
