import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

export default function HeroSection() {
  const { ref: textRef, isVisible: textVisible } = useScrollAnimation();
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation({ delay: 200 });

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 z-0"></div>
      <div className="absolute right-0 bottom-0 w-2/3 h-2/3 opacity-20 dark:opacity-10">
        <div className="w-full h-full bg-blue-500 rounded-full filter blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            ref={textRef}
            initial={{ opacity: 0, y: 20 }}
            animate={textVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full md:w-1/2 mb-12 md:mb-0"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900 dark:text-white">
              Automasi Dan Efisiensi Proses<span className="text-primary"> Surat-Menyurat</span> Pada Organisasi
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
              “Letterly” merupakan aplikasi administrasi surat-menyurat yang menerapkan konsep Customize, kami menawarkan beberapa paket dengan pilihan fitur berbeda-beda sesuai dengan kebutuhan konsumen, selain itu konsumen juga dapat melakukan pemilihan desain penambahan fitur maupun Custom Design, and Featured.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/services">
                <Button size="lg" className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-lg transition-all font-medium text-center">
                  Explore Our Services
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="border-2 border-primary hover:bg-primary hover:text-white text-primary dark:text-blue-400 dark:hover:text-white px-8 py-4 rounded-lg transition-all font-medium text-center">
                  View Our Work
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            ref={imageRef}
            initial={{ opacity: 0, y: 20 }}
            animate={imageVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="w-full md:w-1/2"
          >
            <img 
              src="https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80" 
              alt="Modern office with team collaboration" 
              className="w-full h-auto rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-500" 
            />
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
          className="flex justify-center mt-20"
        >
          <a href="#about" className="text-primary dark:text-blue-400 hover:text-blue-600">
            <i className="fas fa-chevron-down text-2xl"></i>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
