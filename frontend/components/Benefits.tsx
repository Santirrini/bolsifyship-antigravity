import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

export default function Benefits() {
    const benefits = [
        {
            icon: <Truck className="w-8 h-8 text-blue-600" />,
            title: "Envío Gratis",
            description: "En pedidos superiores a $50"
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
            title: "Pago Seguro",
            description: "100% protección en tu compra"
        },
        {
            icon: <RefreshCw className="w-8 h-8 text-blue-600" />,
            title: "Devoluciones Fáciles",
            description: "30 días de garantía"
        },
        {
            icon: <Headphones className="w-8 h-8 text-blue-600" />,
            title: "Soporte 24/7",
            description: "Atención al cliente dedicada"
        }
    ];

    return (
        <section className="py-12 bg-gray-50 dark:bg-neutral-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-4 p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-neutral-800">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                                {benefit.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{benefit.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
