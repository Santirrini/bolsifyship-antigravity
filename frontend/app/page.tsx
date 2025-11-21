import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Benefits from "@/components/Benefits";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import Link from 'next/link';

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
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative h-64 md:h-80">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop')" }}
            ></div>
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6 text-white">
              <h3 className="text-3xl md:text-5xl font-bold mb-4">Oferta Especial de Temporada</h3>
              <p className="text-lg mb-8 max-w-xl">Aprovecha descuentos increíbles en toda la tienda por tiempo limitado.</p>
              <Link href="/search?on_sale=true" className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors inline-block">
                Ver Descuentos
              </Link>
            </div>
          </div>
        </section>

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
