import ServicesSection from '@/components/services-section';
import CTASection from '@/components/cta-section';

export default function Services() {
  return (
    <main className="pt-24">
      <div className="bg-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Our Services</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Comprehensive digital solutions tailored to help your business grow and transform.
          </p>
        </div>
      </div>
      <ServicesSection />
      <CTASection />
    </main>
  );
}
