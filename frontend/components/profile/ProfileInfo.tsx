import React, { useState } from 'react';
import { userService } from '@/services/user';

interface ProfileInfoProps {
    user: any;
    onUpdate: () => void;
}

export default function ProfileInfo({ user, onUpdate }: ProfileInfoProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: user.full_name || '',
        email: user.email || '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updateData: any = {
                full_name: formData.full_name,
                email: formData.email
            };
            if (formData.password) {
                updateData.password = formData.password;
            }
            await userService.updateProfile(updateData);
            setIsEditing(false);
            onUpdate();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    if (!isEditing) {
        return (
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Información Personal</h2>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                        Editar
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-neutral-500 dark:text-neutral-400">Nombre Completo</label>
                        <p className="text-neutral-900 dark:text-white font-medium">{user.full_name || 'No especificado'}</p>
                    </div>
                    <div>
                        <label className="text-sm text-neutral-500 dark:text-neutral-400">Email</label>
                        <p className="text-neutral-900 dark:text-white font-medium">{user.email}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Editar Perfil</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Nombre Completo
                    </label>
                    <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Nueva Contraseña (opcional)
                    </label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Dejar en blanco para mantener la actual"
                    />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
}
