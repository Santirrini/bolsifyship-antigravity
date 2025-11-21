"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { bannerService, Banner, BannerCreate, BannerUpdate } from "@/services/bannerService";

interface BannerFormProps {
    initialData?: Banner;
    isEditing?: boolean;
}

export default function BannerForm({ initialData, isEditing = false }: BannerFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<BannerCreate>({
        title: "",
        subtitle: "",
        highlight_text: "",
        description: "",
        image_url: "",
        link_url: "",
        position: "hero",
        is_active: 1,
        order: 0,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                subtitle: initialData.subtitle || "",
                highlight_text: initialData.highlight_text || "",
                description: initialData.description || "",
                image_url: initialData.image_url,
                link_url: initialData.link_url || "",
                position: initialData.position,
                is_active: initialData.is_active,
                order: initialData.order,
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "order" || name === "is_active" ? (parseInt(value) || 0) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditing && initialData) {
                await bannerService.update(initialData.id, formData);
            } else {
                await bannerService.create(formData);
            }
            router.push("/admin/banners");
            router.refresh();
        } catch (error) {
            console.error("Error saving banner:", error);
            alert("Failed to save banner");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/banners"
                    className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h2 className="text-3xl font-bold text-white">
                        {isEditing ? "Edit Banner" : "New Banner"}
                    </h2>
                    <p className="text-gray-400 mt-1">
                        {isEditing ? "Update banner details" : "Create a new banner"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
                            placeholder="e.g., Summer Sale"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Subtitle</label>
                        <input
                            type="text"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
                            placeholder="e.g., New Collection"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Highlight Text</label>
                        <input
                            type="text"
                            name="highlight_text"
                            value={formData.highlight_text}
                            onChange={handleChange}
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
                            placeholder="e.g., 50% OFF"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Image URL</label>
                        <input
                            type="url"
                            name="image_url"
                            required
                            value={formData.image_url}
                            onChange={handleChange}
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Link URL</label>
                        <input
                            type="text"
                            name="link_url"
                            value={formData.link_url}
                            onChange={handleChange}
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
                            placeholder="/products/123"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Position</label>
                        <select
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
                        >
                            <option value="hero">Hero Slider</option>
                            <option value="home_middle">Home Middle Section</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Order</label>
                        <input
                            type="number"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Status</label>
                        <select
                            name="is_active"
                            value={formData.is_active}
                            onChange={handleChange}
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
                        >
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
                        placeholder="Banner description..."
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        <span>{isEditing ? "Update Banner" : "Create Banner"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
