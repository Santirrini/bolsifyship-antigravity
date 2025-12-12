'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { catalogService, Product } from '@/services/catalog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ShoppingCart, Search, Menu, ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await catalogService.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300 font-sans selection:bg-blue-500 selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button className="p-2 -ml-2 text-gray-600 dark:text-gray-300 md:hidden">
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
                BOLSIFY
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="#" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Shop</Link>
              <Link href="#" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Categories</Link>
              <Link href="#" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">New Arrivals</Link>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <Link href="/cart" className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
              </Link>
              <ThemeToggle />
              <Link href="/login" className="ml-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Dynamic Hero Section */}
        <section className="relative h-[500px] md:h-[600px] flex items-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-900 to-black z-0">
            {/* Abstract decorative elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/20 to-transparent blur-3xl transform translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-purple-500/20 to-transparent blur-3xl transform -translate-x-1/2"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-bold mb-6 backdrop-blur-sm">
                NEW COLLECTION 2025
              </span>
              <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-8">
                Redefine Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Digital Style</span>
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-lg leading-relaxed">
                Discover the latest trends in digital fashion. Premium quality, exclusive designs, and instant delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#products" className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                  Start Shopping <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-colors">
                  View Lookbook
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Trending Now</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Curated picks just for you</p>
            </div>
            <Link href="#" className="hidden md:flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
              View all products <ArrowRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-neutral-900 rounded-2xl p-4 h-[400px] animate-pulse border border-gray-100 dark:border-neutral-800">
                  <div className="w-full h-2/3 bg-gray-200 dark:bg-neutral-800 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link href="#" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
              View all products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">© 2025 Bolsify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
