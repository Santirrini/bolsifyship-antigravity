"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Image as ImageIcon } from "lucide-react";
import { bannerService, Banner } from "@/services/bannerService";

export default function AdminBanners() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const data = await bannerService.getAll();
            setBanners(data);
        } catch (error) {
            console.error("Error fetching banners:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this banner?")) return;

        try {
            await bannerService.delete(id);
            setBanners(banners.filter((b) => b.id !== id));
        } catch (error) {
            console.error("Error deleting banner:", error);
            alert("Failed to delete banner");
        }
    };

    const filteredBanners = banners.filter((banner) =>
        banner.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Banners</h2>
                    <p className="text-gray-400 mt-1">Manage home page banners and sliders</p>
                </div>
                <Link
                    href="/admin/banners/new"
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Banner</span>
                </Link>
            </div>

            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-800">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search banners..."
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
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Position</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Order</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center">
                                        Loading banners...
                                    </td>
                                </tr>
                            ) : filteredBanners.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center">
                                        No banners found.
                                    </td>
                                </tr>
                            ) : (
                                filteredBanners.map((banner) => (
                                    <tr key={banner.id} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="w-20 h-12 rounded-lg bg-gray-800 overflow-hidden">
                                                {banner.image_url ? (
                                                    <img
                                                        src={banner.image_url}
                                                        alt={banner.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                        <ImageIcon className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{banner.title}</div>
                                            {banner.subtitle && <div className="text-xs text-gray-500">{banner.subtitle}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-lg text-xs">
                                                {banner.position}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-lg text-xs ${banner.is_active
                                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                                                }`}>
                                                {banner.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{banner.order}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/banners/edit/${banner.id}`}
                                                    className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(banner.id)}
                                                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
