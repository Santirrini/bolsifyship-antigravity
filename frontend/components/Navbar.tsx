'use client';

import { ShoppingBag, Search, Menu, Heart, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LoginModal from './LoginModal';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import UserMenu from './UserMenu';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { openCart, openWishlist, openLoginModal, isLoginOpen, closeLoginModal, authView } = useUI();

  const handleAuthModal = (view: 'login' | 'register') => {
    openLoginModal(view);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 1) {
        try {
          const res = await fetch(`http://localhost:8000/search/suggest?query=${encodeURIComponent(query)}`);
          if (res.ok) {
            const data = await res.json();
            setSuggestions(data);
          }
        } catch (error) {
          console.error("Failed to fetch suggestions", error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSuggestions([]);
      setIsSearchOpen(false); // Close mobile search on submit
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    setIsSearchOpen(false); // Close mobile search on selection
    router.push(`/search?query=${encodeURIComponent(suggestion)}`);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-neutral-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Left Section: Logo & Nav */}
            <div className="flex items-center gap-8 lg:gap-12">
              {/* Logo & Mobile Menu */}
              <div className="flex items-center gap-2">
                <button
                  className="p-2 -ml-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white lg:hidden transition-colors"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <Menu className="w-6 h-6" />
                </button>
                <Link href="/" className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  Bolsifyshop
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-8">
                {[
                  { name: 'Inicio', href: '/' },
                  { name: 'Explorar', href: '/search' },
                  { name: 'Categorías', href: '/categories' },
                  { name: 'Ofertas', href: '/offers' },
                  { name: 'Vender', href: '/business' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 group py-2
                      ${pathname === link.href ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-300'}
                    `}
                  >
                    {link.name}
                    <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400 transform origin-left transition-transform duration-300 ease-out
                      ${pathname === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                    `} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 bg-zinc-100 dark:bg-neutral-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              </form>
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-neutral-800 rounded-lg shadow-lg z-50 overflow-hidden">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-neutral-800 flex items-center gap-2"
                    >
                      <Search className="w-3 h-3 text-zinc-400" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors md:hidden"
              >
                <Search className="w-6 h-6" />
              </button>
              <button
                onClick={openWishlist}
                className="hidden sm:block p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <Heart className="w-6 h-6" />
              </button>

              <ThemeToggle />

              {user ? (
                <UserMenu />
              ) : (
                <>
                  <button
                    onClick={() => handleAuthModal('login')}
                    className="hidden sm:block px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors border border-zinc-300 dark:border-neutral-700 rounded-full hover:bg-zinc-50 dark:hover:bg-neutral-800"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => handleAuthModal('register')}
                    className="hidden sm:block px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors rounded-full shadow-sm"
                  >
                    Crear Cuenta
                  </button>
                </>
              )}

              <button
                onClick={openCart}
                className="relative p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-0 w-4 h-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar - Expandable */}
          {isSearchOpen && (
            <div className="md:hidden pb-4 animate-slide-down">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-2 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 bg-zinc-100 dark:bg-neutral-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              </form>
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-neutral-800 rounded-lg shadow-lg z-50 overflow-hidden">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-neutral-800 flex items-center gap-2"
                    >
                      <Search className="w-3 h-3 text-zinc-400" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className="absolute top-0 right-0 w-[280px] h-full bg-white dark:bg-neutral-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 flex justify-between items-center border-b border-zinc-100 dark:border-neutral-800">
              <span className="font-bold text-lg text-zinc-900 dark:text-white">Menú</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-2">
              {[
                { name: 'Inicio', href: '/' },
                { name: 'Explorar', href: '/search' },
                { name: 'Categorías', href: '/categories' },
                { name: 'Ofertas', href: '/offers' },
                { name: 'Vender', href: '/business' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-medium px-4 py-3 rounded-xl transition-colors
                    ${pathname === link.href
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-neutral-800'}
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {!user && (
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={() => handleAuthModal('login')}
                    className="w-full py-3 text-sm font-medium text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-neutral-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => handleAuthModal('register')}
                    className="w-full py-3 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors rounded-xl shadow-sm"
                  >
                    Crear Cuenta
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <LoginModal isOpen={isLoginOpen} onClose={closeLoginModal} initialView={authView} />
    </>
  );
}
