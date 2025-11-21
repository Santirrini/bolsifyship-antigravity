import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Info */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent inline-block">
                            Bolsifyshop
                        </h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Tu destino premium para compras online. Calidad, estilo y los mejores precios en un solo lugar.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Enlaces Rápidos</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Sobre Nosotros</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Nuestras Tiendas</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Contacto</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Mapa del Sitio</a></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Atención al Cliente</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Centro de Ayuda</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Envíos y Devoluciones</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Términos y Condiciones</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Política de Privacidad</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Rastrea tu Orden</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Contáctanos</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                                <span>Av. Principal 123, Ciudad de México, México</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>+52 55 1234 5678</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>contacto@bolsifyshop.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Bolsifyshop. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
