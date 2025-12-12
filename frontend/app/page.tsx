'use client';

import { useEffect, useState } from 'react';
import { catalogService, Product } from '@/services/catalog';
import { ProductCard } from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await catalogService.getProducts();
        // Map backend 'name' field to frontend 'title' field for ProductCard compatibility
        const mappedData = data.map(p => ({
          ...p,
          title: p.title || p.name || 'Product',
        }));
        setProducts(mappedData);
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
      {/* Use shared Navbar component */}
      <Navbar />

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
                <Link href="/search" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-colors text-center">
                  View Lookbook
                </Link>
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
            <Link href="/search" className="hidden md:flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
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
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No products available yet.</p>
              <Link href="/search" className="mt-4 inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Explore our catalog <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-x-8 md:gap-y-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link href="/search" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
              View all products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">© 2025 Bolsifyshop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

