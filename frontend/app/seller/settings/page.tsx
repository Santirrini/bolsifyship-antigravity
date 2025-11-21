"use client";

import React, { useEffect, useState } from "react";
import { Save, Store as StoreIcon } from "lucide-react";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function SellerSettings() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasStore, setHasStore] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        logo_url: "",
    });

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const response = await api.get("/seller/store");
                setFormData({
                    name: response.data.name,
                    description: response.data.description || "",
                    logo_url: response.data.logo_url || "",
                });
                setHasStore(true);
            } catch (error: any) {
                if (error.response?.status === 404) {
                    setHasStore(false);
                } else {
                    console.error("Error fetching store:", error);
                }
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchStore();
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (hasStore) {
                await api.put("/seller/store", formData);
                alert("Tienda actualizada correctamente");
            } else {
                await api.post("/seller/register", formData);
                setHasStore(true);
                alert("Tienda creada correctamente");
                // Optionally reload user to update role if needed, though backend handles it
                window.location.reload();
            }
        } catch (error) {
            console.error("Error saving store:", error);
            alert("Error al guardar la tienda");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Cargando configuración...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {hasStore ? "Configuración de la Tienda" : "Crear tu Tienda"}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                    {hasStore
                        ? "Actualiza la información de tu tienda."
                        : "Registra tu tienda para empezar a vender."}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de la Tienda</label>
                    <div className="relative">
                        <StoreIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                    <textarea
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo URL</label>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            name="logo_url"
                            value={formData.logo_url}
                            onChange={handleChange}
                            placeholder="https://ejemplo.com/logo.png"
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {formData.logo_url && (
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                                <img src={formData.logo_url} alt="Logo" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-5 h-5 mr-2" />
                        {saving ? "Guardando..." : hasStore ? "Guardar Cambios" : "Crear Tienda"}
                    </button>
                </div>
            </form>
        </div>
    );
}
