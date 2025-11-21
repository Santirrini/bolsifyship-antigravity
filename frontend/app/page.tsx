import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Benefits from "@/components/Benefits";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import Link from 'next/link';
import MiddleBanner from "@/components/MiddleBanner";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      <Navbar />

      <main>
        <Hero />
        <Benefits />
        <Categories />
        <FeaturedProducts />

        {/* Banner Section */}
        <MiddleBanner />

        <Newsletter />
      </main>

      <Footer />

      {/* Mobile Bottom Nav - Hidden on Desktop */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
