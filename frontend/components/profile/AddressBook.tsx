import React, { useState, useEffect } from 'react';
import { userService } from '@/services/user';
import { Trash2, Edit2, Plus, MapPin } from 'lucide-react';

export default function AddressBook() {
    const [addresses, setAddresses] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        full_name: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
        phone: '',
        is_default: false
    });

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            const data = await userService.getAddresses();
            setAddresses(data);
        } catch (error) {
            console.error('Error loading addresses:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await userService.updateAddress(editingId, { ...formData, is_default: formData.is_default ? 1 : 0 });
            } else {
                await userService.createAddress({ ...formData, is_default: formData.is_default ? 1 : 0 });
            }
            setIsAdding(false);
            setEditingId(null);
            resetForm();
            loadAddresses();
        } catch (error) {
            console.error('Error saving address:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta dirección?')) return;
        try {
            await userService.deleteAddress(id);
            loadAddresses();
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    const startEdit = (address: any) => {
        setFormData({
            full_name: address.full_name,
            address_line1: address.address_line1,
            address_line2: address.address_line2 || '',
            city: address.city,
            state: address.state,
            zip_code: address.zip_code,
            country: address.country,
            phone: address.phone,
            is_default: address.is_default === 1
        });
        setEditingId(address.id);
        setIsAdding(true);
    };

    const resetForm = () => {
        setFormData({
            full_name: '',
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            zip_code: '',
            country: '',
            phone: '',
            is_default: false
        });
    };

    if (isAdding) {
        return (
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
                    {editingId ? 'Editar Dirección' : 'Nueva Dirección'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Nombre Completo</label>
                            <input
                                type="text"
                                required
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Teléfono</label>
                            <input
                                type="text"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Dirección Línea 1</label>
                        <input
                            type="text"
                            required
                            value={formData.address_line1}
                            onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Dirección Línea 2 (Opcional)</label>
                        <input
                            type="text"
                            value={formData.address_line2}
                            onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white"
                        />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Ciudad</label>
                            <input
                                type="text"
                                required
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Estado/Provincia</label>
                            <input
                                type="text"
                                required
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Código Postal</label>
                            <input
                                type="text"
                                required
                                value={formData.zip_code}
                                onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">País</label>
                            <input
                                type="text"
                                required
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_default"
                            checked={formData.is_default}
                            onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                            className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="is_default" className="text-sm text-neutral-700 dark:text-neutral-300">Establecer como predeterminada</label>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}
                            className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                        >
                            Guardar Dirección
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Direcciones de Envío</h2>
                <button
                    onClick={() => { resetForm(); setIsAdding(true); }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                    <Plus size={16} />
                    Nueva Dirección
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                    <div key={address.id} className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800 relative group">
                        {address.is_default === 1 && (
                            <span className="absolute top-4 right-4 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                                Predeterminada
                            </span>
                        )}
                        <div className="flex items-start gap-3 mb-4">
                            <MapPin className="text-neutral-400 mt-1" size={20} />
                            <div>
                                <h3 className="font-medium text-neutral-900 dark:text-white">{address.full_name}</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                    {address.address_line1}
                                    {address.address_line2 && <br />}
                                    {address.address_line2}
                                    <br />
                                    {address.city}, {address.state} {address.zip_code}
                                    <br />
                                    {address.country}
                                </p>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                                    {address.phone}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                            <button
                                onClick={() => startEdit(address)}
                                className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                <Edit2 size={14} /> Editar
                            </button>
                            <button
                                onClick={() => handleDelete(address.id)}
                                className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 ml-auto"
                            >
                                <Trash2 size={14} /> Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
