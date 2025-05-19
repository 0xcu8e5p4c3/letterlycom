import HeroSection from '@/components/hero-section';
import AboutSection from '@/components/about-section';
import ServicesSection from '@/components/services-section';
import ProductsSection from '@/components/products-section';
import PortfolioSection from '@/components/portfolio-section';
import TeamSection from '@/components/team-section';
import ContactSection from '@/components/contact-section';
import FAQSection from '@/components/faq-section';
import CTASection from '@/components/cta-section';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll event for showing scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ProductsSection />
      <PortfolioSection />
      <TeamSection />

      <ContactSection />
      <FAQSection />
      <CTASection />
      
      {/* Scroll to top button */}
      <Button
        variant="default"
        size="icon"
        className={`fixed bottom-6 right-6 bg-primary hover:bg-blue-600 text-white rounded-full shadow-lg z-50 transition-opacity duration-300 ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={scrollToTop}
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </main>
  );
}
