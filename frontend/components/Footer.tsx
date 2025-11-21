import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-zinc-900 dark:bg-black text-zinc-400 dark:text-zinc-500 pt-16 pb-24 md:pb-8 border-t border-zinc-800 dark:border-neutral-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Info */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6">
                            Bolsifyshop
                        </h3>
                        <p className="text-zinc-400 dark:text-zinc-500 mb-6 leading-relaxed">
                            Tu destino premium para compras online. Calidad, estilo y los mejores precios en un solo lugar.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 dark:bg-neutral-900 flex items-center justify-center hover:bg-white hover:text-zinc-900 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 dark:bg-neutral-900 flex items-center justify-center hover:bg-white hover:text-zinc-900 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 dark:bg-neutral-900 flex items-center justify-center hover:bg-white hover:text-zinc-900 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 dark:bg-neutral-900 flex items-center justify-center hover:bg-white hover:text-zinc-900 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-all">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Enlaces Rápidos</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Nuestras Tiendas</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Mapa del Sitio</a></li>
                            <li><Link href="/business" className="hover:text-white transition-colors font-medium">Vender en Bolsifyshop</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Atención al Cliente</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Envíos y Devoluciones</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Rastrea tu Orden</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Contáctanos</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-zinc-500 shrink-0 mt-1" />
                                <span>Av. Principal 123, Ciudad de México, México</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-zinc-500 shrink-0" />
                                <span>+52 55 1234 5678</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-zinc-500 shrink-0" />
                                <span>contacto@bolsifyshop.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-zinc-800 dark:border-neutral-900 pt-8 text-center text-sm text-zinc-500">
                    <p>&copy; {new Date().getFullYear()} Bolsifyshop. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
