'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { catalogService, Product } from '@/services/catalog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ShoppingCart } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 transition-colors duration-300">
      <nav className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bolsifyshop</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <ShoppingCart className="h-6 w-6" />
              </Link>
              <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Featured Products
          </h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Check out our latest collection
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} className="group">
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-neutral-800">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 dark:bg-neutral-800 relative h-64">
                    {/* Placeholder for image - replace with actual image tag using product.image */}
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 dark:text-neutral-600">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 truncate">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        ${product.price}
                      </span>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                        View Details
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
