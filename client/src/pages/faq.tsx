import FAQSection from '@/components/faq-section';
import CTASection from '@/components/cta-section';

export default function FAQ() {
  return (
    <main className="pt-24">
      <div className="bg-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Find answers to common questions about our services and process.
          </p>
        </div>
      </div>
      <FAQSection />
      <CTASection />
    </main>
  );
}
