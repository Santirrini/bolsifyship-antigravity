"use client";

import React, { useEffect, useState } from "react";
import { Save, Store as StoreIcon, Image as ImageIcon, Phone, MapPin, Mail, FileText, Layout } from "lucide-react";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function SellerSettings() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasStore, setHasStore] = useState(false);
    const [activeSection, setActiveSection] = useState("general");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        logo_url: "",
        banner_url: "",
        phone: "",
        address: "",
        contact_email: "",
        shipping_policy: "",
        return_policy: ""
    });

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const response = await api.get("/seller/store");
                setFormData({
                    name: response.data.name || "",
                    description: response.data.description || "",
                    logo_url: response.data.logo_url || "",
                    banner_url: response.data.banner_url || "",
                    phone: response.data.phone || "",
                    address: response.data.address || "",
                    contact_email: response.data.contact_email || "",
                    shipping_policy: response.data.shipping_policy || "",
                    return_policy: response.data.return_policy || ""
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
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const sections = [
        { id: "general", label: "General", icon: StoreIcon },
        { id: "branding", label: "Marca & Diseño", icon: Layout },
        { id: "contact", label: "Contacto", icon: Phone },
        { id: "policies", label: "Políticas", icon: FileText },
    ];

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {hasStore ? "Configuración de la Tienda" : "Crear tu Tienda"}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    {hasStore
                        ? "Personaliza la apariencia y la información de tu tienda para tus clientes."
                        : "Completa la información básica para abrir tu tienda en Bolsifyshop."}
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeSection === section.id
                                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                            >
                                <section.icon className={`mr-3 h-5 w-5 ${activeSection === section.id ? "text-indigo-500" : "text-gray-400"
                                    }`} />
                                {section.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">

                        {/* General Section */}
                        <div className={`p-6 space-y-6 ${activeSection === 'general' ? 'block' : 'hidden'}`}>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4 mb-6">
                                Información General
                            </h3>

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
                                        placeholder="Ej. Moda Urbana"
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
                                    placeholder="Describe tu tienda y lo que vendes..."
                                />
                                <p className="mt-1 text-sm text-gray-500">Una breve descripción que aparecerá en tu perfil.</p>
                            </div>
                        </div>

                        {/* Branding Section */}
                        <div className={`p-6 space-y-6 ${activeSection === 'branding' ? 'block' : 'hidden'}`}>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4 mb-6">
                                Marca y Diseño
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo URL</label>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                name="logo_url"
                                                value={formData.logo_url}
                                                onChange={handleChange}
                                                placeholder="https://ejemplo.com/logo.png"
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">Recomendado: 400x400px, formato PNG o JPG.</p>
                                    </div>
                                    <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0 flex items-center justify-center">
                                        {formData.logo_url ? (
                                            <img src={formData.logo_url} alt="Logo Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <StoreIcon className="w-8 h-8 text-gray-300" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Banner URL</label>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            name="banner_url"
                                            value={formData.banner_url}
                                            onChange={handleChange}
                                            placeholder="https://ejemplo.com/banner.png"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                                        {formData.banner_url ? (
                                            <img src={formData.banner_url} alt="Banner Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center text-gray-400">
                                                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                <span className="text-sm">Vista previa del banner</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">Recomendado: 1200x400px. Esta imagen aparecerá en la parte superior de tu tienda.</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Section */}
                        <div className={`p-6 space-y-6 ${activeSection === 'contact' ? 'block' : 'hidden'}`}>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4 mb-6">
                                Información de Contacto
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email de Contacto</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            name="contact_email"
                                            value={formData.contact_email}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="contacto@tutienda.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección Física</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                    <textarea
                                        name="address"
                                        rows={3}
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Calle Principal 123, Ciudad, País"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Policies Section */}
                        <div className={`p-6 space-y-6 ${activeSection === 'policies' ? 'block' : 'hidden'}`}>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4 mb-6">
                                Políticas de la Tienda
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Política de Envíos</label>
                                <textarea
                                    name="shipping_policy"
                                    rows={4}
                                    value={formData.shipping_policy}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Explica tus tiempos de envío, costos y transportistas..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Política de Devoluciones</label>
                                <textarea
                                    name="return_policy"
                                    rows={4}
                                    value={formData.return_policy}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Detalla las condiciones para devoluciones y reembolsos..."
                                />
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                            >
                                <Save className="w-5 h-5 mr-2" />
                                {saving ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
