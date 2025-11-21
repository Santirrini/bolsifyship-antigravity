import React, { useState, useEffect } from 'react';
import { userService } from '@/services/user';
import { CreditCard, Trash2, Plus } from 'lucide-react';

export default function PaymentMethods() {
    const [methods, setMethods] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        card_holder: '',
        card_number: '',
        expiry_date: '',
        cvv: '',
        is_default: false
    });

    useEffect(() => {
        loadMethods();
    }, []);

    const loadMethods = async () => {
        try {
            const data = await userService.getPaymentMethods();
            setMethods(data);
        } catch (error) {
            console.error('Error loading payment methods:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // In a real app, you would integrate with Stripe/Payment processor here
            // and only save the token/last4. For this demo we simulate it.
            const lastFour = formData.card_number.slice(-4);
            const cardType = getCardType(formData.card_number);

            await userService.createPaymentMethod({
                card_holder: formData.card_holder,
                last_four: lastFour,
                card_type: cardType,
                expiry_date: formData.expiry_date,
                is_default: formData.is_default ? 1 : 0
            });

            setIsAdding(false);
            resetForm();
            loadMethods();
        } catch (error) {
            console.error('Error saving payment method:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este método de pago?')) return;
        try {
            await userService.deletePaymentMethod(id);
            loadMethods();
        } catch (error) {
            console.error('Error deleting payment method:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            card_holder: '',
            card_number: '',
            expiry_date: '',
            cvv: '',
            is_default: false
        });
    };

    const getCardType = (number: string) => {
        if (number.startsWith('4')) return 'Visa';
        if (number.startsWith('5')) return 'Mastercard';
        return 'Card';
    };

    if (isAdding) {
        return (
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Nuevo Método de Pago</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Titular de la Tarjeta</label>
                        <input
                            type="text"
                            required
                            value={formData.card_holder}
                            onChange={(e) => setFormData({ ...formData, card_holder: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Número de Tarjeta</label>
                        <input
                            type="text"
                            required
                            maxLength={16}
                            value={formData.card_number}
                            onChange={(e) => setFormData({ ...formData, card_number: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Expiración (MM/YY)</label>
                            <input
                                type="text"
                                required
                                placeholder="MM/YY"
                                value={formData.expiry_date}
                                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">CVV</label>
                            <input
                                type="text"
                                required
                                maxLength={4}
                                value={formData.cvv}
                                onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_default_card"
                            checked={formData.is_default}
                            onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                            className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="is_default_card" className="text-sm text-neutral-700 dark:text-neutral-300">Establecer como predeterminada</label>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => { setIsAdding(false); resetForm(); }}
                            className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                        >
                            Guardar Tarjeta
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Métodos de Pago</h2>
                <button
                    onClick={() => { resetForm(); setIsAdding(true); }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                    <Plus size={16} />
                    Nuevo Método
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {methods.map((method) => (
                    <div key={method.id} className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800 relative">
                        {method.is_default === 1 && (
                            <span className="absolute top-4 right-4 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                                Predeterminada
                            </span>
                        )}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-8 bg-neutral-100 dark:bg-neutral-800 rounded flex items-center justify-center">
                                <CreditCard className="text-neutral-600 dark:text-neutral-400" size={20} />
                            </div>
                            <div>
                                <h3 className="font-medium text-neutral-900 dark:text-white">{method.card_type} •••• {method.last_four}</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">Expira {method.expiry_date}</p>
                            </div>
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">{method.card_holder}</p>
                        <div className="flex justify-end pt-4 border-t border-neutral-100 dark:border-neutral-800">
                            <button
                                onClick={() => handleDelete(method.id)}
                                className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400"
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
