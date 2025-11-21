"use client";

import React from "react";
import Navbar from "../../components/Navbar";
import OfferSection from "../../components/OfferSection";

export default function OffersPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
            <Navbar />

            {/* Epic Hero Section */}
            <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/30 to-white dark:from-purple-900/50 dark:to-black z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 dark:opacity-40 animate-pulse-slow" />

                <div className="relative z-20 text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-600 mb-4 drop-shadow-lg">
                        Epic Offers
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                        Discover exclusive deals, seasonal specials, and limited-time treasures.
                    </p>
                </div>
            </div>

            {/* Offer Sections */}
            <div className="max-w-7xl mx-auto space-y-8 pb-20">
                <OfferSection
                    title="Trending Now"
                    subtitle="The hottest items everyone is talking about."
                    endpoint="trending"
                />

                <OfferSection
                    title="Prepare for the Holidays"
                    subtitle="Get ready for the season with these picks."
                    endpoint="pre-season"
                />

                <OfferSection
                    title="Last Chance"
                    subtitle="Grab these seasonal favorites before they're gone."
                    endpoint="past-season"
                />

                <OfferSection
                    title="Clearance Sale"
                    subtitle="Unbeatable prices on last pieces."
                    endpoint="clearance"
                />
            </div>
        </div>
    );
}
