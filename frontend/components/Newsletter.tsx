import { Mail } from 'lucide-react';

export default function Newsletter() {
    return (
        <section className="py-16 bg-blue-600 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="text-center lg:text-left text-white max-w-xl">
                        <h2 className="text-3xl font-bold mb-4">Suscríbete a nuestro Newsletter</h2>
                        <p className="text-blue-100 text-lg">
                            Recibe las últimas novedades, ofertas exclusivas y descuentos especiales directamente en tu correo.
                        </p>
                    </div>

                    <div className="w-full max-w-md">
                        <form className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Tu correo electrónico"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-blue-300 outline-none text-gray-900"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-lg"
                            >
                                Suscribirse
                            </button>
                        </form>
                        <p className="text-blue-200 text-xs mt-3 text-center lg:text-left">
                            Al suscribirte aceptas nuestros términos y condiciones. Puedes cancelar en cualquier momento.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
