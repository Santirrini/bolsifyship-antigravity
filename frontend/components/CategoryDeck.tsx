"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";

interface Category {
    name: string;
    image: string | null;
}

interface CategoryDeckProps {
    categories: Category[];
}

export default function CategoryDeck({ categories }: CategoryDeckProps) {
    const [cards, setCards] = useState(categories);
    const router = useRouter();

    const removeCard = (name: string) => {
        setCards((prev) => prev.filter((card) => card.name !== name));
    };

    const handleSwipe = (name: string) => {
        removeCard(name);
        // Optional: Navigate to category on swipe? Or maybe just discard?
        // User request says "visualize each category... see what it offers".
        // Maybe clicking selects it, swiping discards it to see the next one.
    };

    const handleClick = (name: string) => {
        router.push(`/search?category=${encodeURIComponent(name)}`);
    };

    // If no cards left, show a "Reset" or "Explore All" button
    if (cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-bold mb-4 text-white">Explored All Categories!</h2>
                <button
                    onClick={() => setCards(categories)}
                    className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition"
                >
                    Start Over
                </button>
            </div>
        );
    }

    // We only render the top few cards for performance, but for simplicity render all in reverse order
    // so the first one is on top.
    return (
        <div className="relative w-full max-w-md h-96 mx-auto flex items-center justify-center">
            <AnimatePresence>
                {cards.slice().reverse().map((category, index) => {
                    const isTop = index === cards.length - 1;
                    return (
                        <Card
                            key={category.name}
                            category={category}
                            isTop={isTop}
                            onSwipe={() => handleSwipe(category.name)}
                            onClick={() => handleClick(category.name)}
                            index={index} // This index is reversed relative to the original array
                            total={cards.length}
                        />
                    );
                })}
            </AnimatePresence>
        </div>
    );
}

interface CardProps {
    category: Category;
    isTop: boolean;
    onSwipe: () => void;
    onClick: () => void;
    index: number;
    total: number;
}

function Card({ category, isTop, onSwipe, onClick, index, total }: CardProps) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-30, 30]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Stack effect
    // The top card (last in the reversed list) should be at scale 1
    // Cards behind should be smaller and lower
    // index 0 is the bottom-most card visually (first in the reversed list, so last in the actual stack?)
    // Wait, I reversed the list.
    // Original: [A, B, C]. Reversed: [C, B, A].
    // Map: C (index 0), B (index 1), A (index 2).
    // A is top. index = 2. total = 3.
    // offset = total - 1 - index.
    // A: 3 - 1 - 2 = 0.
    // B: 3 - 1 - 1 = 1.
    // C: 3 - 1 - 0 = 2.

    const offset = total - 1 - index;
    const scale = 1 - offset * 0.05;
    const y = offset * 15;
    const zIndex = index;

    return (
        <motion.div
            style={{
                x: isTop ? x : 0,
                rotate: isTop ? rotate : 0,
                opacity: isTop ? opacity : 1 - offset * 0.2,
                scale,
                y,
                zIndex,
            }}
            drag={isTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -10000 || swipe > 10000) {
                    onSwipe();
                }
            }}
            onClick={onClick}
            className="absolute top-0 w-72 h-96 bg-gray-800 rounded-2xl shadow-2xl overflow-hidden cursor-pointer border border-gray-700"
            whileHover={isTop ? { scale: 1.05 } : {}}
        >
            {category.image ? (
                <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-3/4 object-cover pointer-events-none"
                />
            ) : (
                <div className="w-full h-3/4 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                    <span className="text-4xl">🛍️</span>
                </div>
            )}
            <div className="h-1/4 flex items-center justify-center bg-gray-900 p-4">
                <h3 className="text-xl font-bold text-white">{category.name}</h3>
            </div>
        </motion.div>
    );
}
