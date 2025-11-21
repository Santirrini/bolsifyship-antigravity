'use client';

import { ShoppingBag, Search, Menu, User, Heart } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginModal from './LoginModal';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // New state for mobile search
  const router = useRouter();
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
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-gray-100 dark:border-neutral-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Left Section: Logo & Nav */}
            <div className="flex items-center gap-8 lg:gap-12">
              {/* Logo & Mobile Menu */}
              <div className="flex items-center gap-2">
                <button
                  className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white lg:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <Menu className="w-6 h-6" />
                </button>
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Bolsifyshop
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-6">
                <Link href="/" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Inicio</Link>
                <Link href="/search" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Explorar</Link>
                <Link href="/categories" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Categorías</Link>
                <Link href="/offers" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Ofertas</Link>
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
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-neutral-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </form>
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-lg shadow-lg z-50 overflow-hidden">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Search className="w-3 h-3 text-gray-400" />
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
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors md:hidden"
              >
                <Search className="w-6 h-6" />
              </button>
              <button
                onClick={openWishlist}
                className="hidden sm:block p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Heart className="w-6 h-6" />
              </button>

              <ThemeToggle />

              {user ? (
                <div className="flex items-center gap-4">
                  <Link href="/profile" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Hola, {user.full_name || user.email}
                  </Link>
                  <button
                    onClick={logout}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthModal('login')}
                    className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-gray-200 dark:border-neutral-700 rounded-full hover:bg-gray-50 dark:hover:bg-neutral-800"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => handleAuthModal('register')}
                    className="hidden sm:block px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-full shadow-md hover:shadow-lg"
                  >
                    Crear Cuenta
                  </button>
                </>
              )}

              <button
                onClick={openCart}
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
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
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-neutral-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </form>
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-lg shadow-lg z-50 overflow-hidden">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Search className="w-3 h-3 text-gray-400" />
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
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute top-16 left-0 w-full bg-white dark:bg-neutral-900 border-b border-gray-100 dark:border-neutral-800 shadow-xl p-4 flex flex-col gap-4 animate-slide-down" onClick={e => e.stopPropagation()}>
            <Link href="/" className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 py-2 border-b border-gray-50 dark:border-neutral-800" onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link>
            <Link href="/search" className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 py-2 border-b border-gray-50 dark:border-neutral-800" onClick={() => setIsMobileMenuOpen(false)}>Explorar</Link>
            <Link href="/categories" className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 py-2 border-b border-gray-50 dark:border-neutral-800" onClick={() => setIsMobileMenuOpen(false)}>Categorías</Link>
            <Link href="/offers" className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 py-2 border-b border-gray-50 dark:border-neutral-800" onClick={() => setIsMobileMenuOpen(false)}>Ofertas</Link>

            {!user && (
              <div className="flex flex-col gap-3 mt-2">
                <button
                  onClick={() => handleAuthModal('login')}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-neutral-700 rounded-full hover:bg-gray-50 dark:hover:bg-neutral-800"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => handleAuthModal('register')}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-md"
                >
                  Crear Cuenta
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <LoginModal isOpen={isLoginOpen} onClose={closeLoginModal} initialView={authView} />
    </>
  );
}
