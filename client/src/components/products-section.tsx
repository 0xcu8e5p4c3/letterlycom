import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

type Product = {
  name: string;
  description: string;
  image: string;
  features: string[];
  price: string;
  bgColor: string;
  buttonColor: string;
  delay: number;
};

const products: Product[] = [
  {
    name: 'Bronze Plan',
    description: 'A comprehensive data synchronization platform that seamlessly integrates with your existing systems to ensure your data is always up-to-date across all platforms.',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80',
    features: ['Generate nomor surat otomatis', 'Pengarsipan Digital', 'Panel admin', 'Free hosting + Domain'],
    price: 'Starting at Rp.700k/mo',
    bgColor: 'bg-blue-50 dark:bg-gray-800',
    buttonColor: 'bg-primary hover:bg-blue-600',
    delay: 100
  },
  {
    name: 'Silver Plan',
    description: 'A comprehensive data synchronization platform that seamlessly integrates with your existing systems to ensure your data is always up-to-date across all platforms.',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80',
    features: ['Semua fitur bronze plan', 'Generate surat berbasis AI', 'Template surat Profesional', 'dapat melihat surat'],
    price: 'Starting at Rp.1,1Jt/mo',
    bgColor: 'bg-blue-50 dark:bg-gray-800',
    buttonColor: 'bg-primary hover:bg-blue-600',
    delay: 100
  },
  {
    name: 'Gold Plan',
    description: 'An all-in-one marketing automation platform that helps you create, manage, and optimize your digital marketing campaigns across multiple channels.',
    image: 'https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80',
    features: ['Semua fitur silver plan', 'Verifikasi token sekali pakai', 'penerima dapat melihat surat', 'penerima dapat melihat surat'],
    price: 'Starting at Rp.1,4Jt/mo',
    bgColor: 'bg-purple-50 dark:bg-gray-800',
    buttonColor: 'bg-accent hover:bg-purple-600',
    delay: 200
  }
];

export default function ProductsSection() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation({ delay: 300 });

  return (
    <section id="products" className="py-20 md:py-32 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Our <span className="text-primary">Products</span></h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Explore our innovative products designed to help businesses streamline operations and drive growth.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => {
            const { ref, isVisible } = useScrollAnimation({ delay: product.delay });

            return (
              <motion.div 
                key={index}
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: product.delay / 1000 }}
                className={`${product.bgColor} rounded-xl overflow-hidden shadow-md`}
              >
                <img 
                  src={product.image} 
                  alt={`${product.name} dashboard`} 
                  className="w-full h-40 object-cover" 
                />

                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{product.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>

                  <div className="grid grid-cols-1 gap-2 mb-4">
                    {product.features.map((feature, i) => (
                      <div key={i} className="flex items-start text-sm">
                        <div className="text-green-500 mr-2">
                          <i className="fas fa-check-circle text-sm"></i>
                        </div>
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <Link href="/contact">
                      <Button className={`px-4 py-2 ${product.buttonColor} text-white text-sm`}>
                        Buy
                      </Button>
                    </Link>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{product.price}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        
        <motion.div 
          ref={ctaRef}
          initial={{ opacity: 0, y: 20 }}
          animate={ctaVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="mt-16"
        >
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 md:mr-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Customize?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="text-primary dark:text-blue-400 mr-3 mt-1"><i className="fas fa-check-circle"></i></div>
                    <span className="text-gray-600 dark:text-gray-300">150k / Template Surat</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-primary dark:text-blue-400 mr-3 mt-1"><i className="fas fa-check-circle"></i></div>
                    <span className="text-gray-600 dark:text-gray-300">Custom Desain add Start From 350k</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-primary dark:text-blue-400 mr-3 mt-1"><i className="fas fa-check-circle"></i></div>
                    <span className="text-gray-600 dark:text-gray-300">Custom Fitur add Start From 450k</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md w-full md:w-auto">
                <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Contact Us</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Get a 14-day free trial of any of our products. No credit card required.</p>
                <Link href="/contact">
                  <Button className="w-full bg-primary hover:bg-blue-600 text-white">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
