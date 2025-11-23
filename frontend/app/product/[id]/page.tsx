import { productService } from '@/services/product';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import StoreInfoCard from '@/components/product/StoreInfoCard';
import RelatedProducts from '@/components/product/RelatedProducts';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let product;
    let relatedProducts = [];

    try {
        product = await productService.getProduct(parseInt(id));
        // Fetch related products
        try {
            relatedProducts = await productService.getRelatedProducts(parseInt(id));
        } catch (e) {
            console.error("Failed to fetch related products", e);
        }
    } catch (error) {
        notFound();
    }

    if (!product) return notFound();

    const breadcrumbs = [
        { label: 'Products', href: '/search' },
        { label: product.category, href: `/search?category=${product.category}` },
        { label: product.name, href: '#' },
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-24">
                <div className="mb-8">
                    <Breadcrumbs items={breadcrumbs} />
                </div>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 lg:items-start">
                    {/* Left Column: Gallery */}
                    <div className="mb-10 lg:mb-0 relative lg:sticky lg:top-24">
                        <ProductGallery
                            image={product.image}
                            images={product.images}
                            name={product.name}
                        />
                    </div>

                    {/* Right Column: Info & Store */}
                    <div className="flex flex-col gap-10">
                        <ProductInfo product={product} />

                        {product.store && (
                            <div className="border-t border-border pt-8">
                                <h3 className="text-sm font-medium text-foreground mb-4">Sold and shipped by</h3>
                                <StoreInfoCard store={product.store} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products Section */}
                <RelatedProducts products={relatedProducts} />
            </div>
        </div>
    );
}
