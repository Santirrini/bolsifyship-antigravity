"use client";

import React from 'react';
import { ArrowLeft, Mail, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link href="/profile" className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <ArrowLeft size={20} className="mr-2" />
                        Volver al Perfil
                    </Link>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Ayuda y Soporte</h2>

                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-medium text-neutral-900 dark:text-white">Email</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">soporte@bolsifyshop.com</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                                <MessageCircle size={24} />
                            </div>
                            <div>
                                <h3 className="font-medium text-neutral-900 dark:text-white">Chat en Vivo</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">Disponible 9:00 - 18:00</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-medium text-neutral-900 dark:text-white">Teléfono</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">+1 234 567 890</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800">
                        <h3 className="font-medium text-neutral-900 dark:text-white mb-4">Preguntas Frecuentes</h3>
                        <div className="space-y-3">
                            <details className="group">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-neutral-700 dark:text-neutral-300">
                                    <span>¿Cómo rastreo mi pedido?</span>
                                    <span className="transition group-open:rotate-180">
                                        <ArrowLeft size={16} className="rotate-[-90deg]" />
                                    </span>
                                </summary>
                                <p className="text-neutral-500 dark:text-neutral-400 mt-3 group-open:animate-fadeIn">
                                    Puedes rastrear tu pedido desde la sección "Historial de Pedidos" en tu perfil.
                                </p>
                            </details>
                            <details className="group">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-neutral-700 dark:text-neutral-300">
                                    <span>¿Cuál es la política de devolución?</span>
                                    <span className="transition group-open:rotate-180">
                                        <ArrowLeft size={16} className="rotate-[-90deg]" />
                                    </span>
                                </summary>
                                <p className="text-neutral-500 dark:text-neutral-400 mt-3 group-open:animate-fadeIn">
                                    Aceptamos devoluciones dentro de los 30 días posteriores a la compra.
                                </p>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
