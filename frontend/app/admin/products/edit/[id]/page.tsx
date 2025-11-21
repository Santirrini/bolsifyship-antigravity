"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function EditProduct() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        season: "",
    });

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            // Note: Using the public endpoint to fetch details, or admin endpoint if specific details needed
            // Assuming admin endpoint returns same structure or we use public one.
            // Let's use the public one for simplicity if admin get single product isn't explicitly defined in my router above (I defined list, create, update, delete).
            // Wait, I didn't define GET /admin/products/{id} in my router plan! I defined PUT and DELETE.
            // I should probably use the public endpoint GET /products/{id} or add GET /admin/products/{id}.
            // Let's try public endpoint first, assuming it exists from previous work.
            // Actually, looking at file list, there is `routers/search.py` and `routers/categories.py`.
            // I'll assume there is a way to get a product. If not, I might need to add it.
            // Let's assume `GET /products/{id}` exists or I can filter from the list.
            // Better: I'll add GET /admin/products/{id} to router quickly or just use the list and find it? No, list is paginated.
            // I'll try to fetch from `http://localhost:8000/products/${id}` (public).
            const response = await fetch(`http://localhost:8000/products/${id}`);
            if (response.ok) {
                const data = await response.json();
                setFormData({
                    name: data.name,
                    description: data.description || "",
                    price: data.price.toString(),
                    category: data.category,
                    image: data.image || "",
                    season: data.season || "",
                });
            } else {
                alert("Failed to fetch product details");
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8000/admin/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                }),
            });

            if (response.ok) {
                router.push("/admin/products");
            } else {
                alert("Failed to update product");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            alert("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-white">Loading product...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/products"
                    className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h2 className="text-3xl font-bold text-white">Edit Product</h2>
                    <p className="text-gray-400 mt-1">Update product details</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Product Information</h3>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
                                    placeholder="e.g. Premium Leather Bag"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Description</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
                                    placeholder="Product description..."
                                />
                            </div>
                        </div>

                        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Pricing & Inventory</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Price ($)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Organization & Media */}
                    <div className="space-y-6">
                        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Organization</h3>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Category</label>
                                <select
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Bags">Bags</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Shoes">Shoes</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Season</label>
                                <select
                                    name="season"
                                    value={formData.season}
                                    onChange={handleChange}
                                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
                                >
                                    <option value="">None</option>
                                    <option value="summer">Summer</option>
                                    <option value="winter">Winter</option>
                                    <option value="spring">Spring</option>
                                    <option value="autumn">Autumn</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Media</h3>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Image URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
                                        placeholder="https://..."
                                    />
                                </div>
                                {formData.image && (
                                    <div className="mt-4 rounded-xl overflow-hidden border border-gray-700 aspect-video">
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-800">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-5 h-5" />
                        <span>{saving ? "Saving..." : "Save Changes"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
