import ContactSection from '@/components/contact-section';

export default function Contact() {
  return (
    <main className="pt-24">
      <div className="bg-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Contact Us</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Have a project in mind or want to learn more about our services? Reach out to us!
          </p>
        </div>
      </div>
      <ContactSection />
    </main>
  );
}
