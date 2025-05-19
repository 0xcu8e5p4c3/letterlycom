import ProductsSection from '@/components/products-section';
import CTASection from '@/components/cta-section';

export default function Products() {
  return (
    <main className="pt-24">
      <div className="bg-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Our Products</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Innovative solutions designed to help businesses streamline operations and drive growth.
          </p>
        </div>
      </div>
      <ProductsSection />
      <CTASection />
    </main>
  );
}
