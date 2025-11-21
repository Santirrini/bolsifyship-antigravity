"use client";

import React, { useEffect, useState } from "react";
import CategoryDeck from "@/components/CategoryDeck";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Category {
    name: string;
    image: string | null;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("http://localhost:8000/categories/");
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-300">
            <Navbar />
            <main className="flex-grow flex flex-col items-center justify-center p-4 overflow-hidden relative">
                {/* Background elements for premium feel */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 dark:bg-purple-900/30 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 dark:bg-blue-900/30 rounded-full blur-[120px]" />
                </div>

                <div className="z-10 text-center mb-12 mt-8">
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 mb-4">
                        Explore Categories
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
                        Swipe through our collection and find exactly what you're looking for.
                    </p>
                </div>

                <div className="z-10 w-full flex justify-center items-center min-h-[400px]">
                    {loading ? (
                        <div className="text-gray-900 dark:text-white animate-pulse">Loading categories...</div>
                    ) : (
                        <CategoryDeck categories={categories} />
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
