import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PortfolioItem = {
  title: string;
  description: string;
  image: string;
  category: string;
  delay: number;
};

const portfolioItems: PortfolioItem[] = [
  {
    title: 'Astacita.com',
    description: 'Website ini merupakan platform berita modern yang dikembangkan menggunakan Laravel dan Filament. (Fatwa Bawahsi)',
    image: 'https://raw.githubusercontent.com/0xcu8e5p4c3/S-P/main/img/astacita.png',
    category: 'web',
    delay: 200
  },
  {
    title: 'Generate Surat LTG',
    description: 'Website generate surat otomatis dan pengarsipan perusahaan. (Muhammad Farhan Fuady)',
    image: 'https://raw.githubusercontent.com/0xcu8e5p4c3/S-P/main/img/gen.png',
    category: 'web',
    delay: 300
  },
  {
    title: 'Website Portofolio',
    description: '(Fatwa Bawahsi)',
    image: 'https://raw.githubusercontent.com/0xcu8e5p4c3/S-P/main/img/my.png',
    category: 'design',
    delay: 400
  },
  {
    title: 'Website Learning Center',
    description: 'Website Learning Center Perusahaan. (Muhammad Farhan Fuady)',
    image: 'https://raw.githubusercontent.com/0xcu8e5p4c3/S-P/main/img/ltg.jpeg',
    category: 'web',
    delay: 500
  },  
  {
    title: 'Snapall',
    description: 'Website Download semua video menggunakan link dari berbagai platform. (Fatwa Bawahsi)',
    image: 'https://raw.githubusercontent.com/0xcu8e5p4c3/S-P/main/img/snapall.png',
    category: 'web',
    delay: 600
  },
    {
    title: 'Admin Panel LTG',
    description: '(Muhammad Farhan Fuady)',
    image: 'https://raw.githubusercontent.com/0xcu8e5p4c3/S-P/main/img/adminpanel.jpeg',
    category: 'web',
    delay: 600
  },
    {
    title: 'Konco Dolan Desain',
    description: 'Desain Aplikasi Mobile. (Muhammad Farhan Fuady)',
    image: 'https://raw.githubusercontent.com/0xcu8e5p4c3/S-P/main/img/Screenshot 2025-05-19 235243.png',
    category: 'desain',
    delay: 300
  },
];

// Komponen kecil untuk tiap kartu portfolio, agar hooks tidak dipanggil di loop
function PortfolioCard({ item }: { item: PortfolioItem }) {
  const { ref, isVisible } = useScrollAnimation({ delay: item.delay });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: item.delay / 1000 }}
      className="portfolio-item hover:transform hover:scale-105 transition-all duration-300"
      data-category={item.category}
    >
      <div className="group relative overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-gray-800">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-64 object-cover transition-all duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-purple-800/70 to-transparent opacity-0 group-hover:opacity-90 transition-all duration-300 flex flex-col justify-end p-6">
          <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
          <p className="text-gray-100 mb-4 text-sm">{item.description}</p>
          <a href="#" className="text-white bg-blue-500 hover:bg-blue-600 transition-all py-2 px-4 rounded-full inline-flex items-center text-sm font-medium">
            View Project <i className="fas fa-arrow-right ml-2"></i>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState('all');
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: filtersRef, isVisible: filtersVisible } = useScrollAnimation({ delay: 100 });

  const filteredItems = portfolioItems.filter(
    item => activeFilter === 'all' || item.category === activeFilter
  );

  return (
    <section id="portfolio" className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Our <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Portfolio</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our latest projects and see how we've helped businesses achieve their goals.
          </p>
        </motion.div>
        
        <motion.div 
          ref={filtersRef}
          initial={{ opacity: 0, y: 20 }}
          animate={filtersVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mb-10 flex flex-wrap justify-center gap-4"
        >
          {['all', 'web', 'design'].map(filter => (
            <Button 
              key={filter}
              variant={filter === activeFilter ? "default" : "outline"}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "rounded-full capitalize px-6 py-2 font-medium transition-all duration-300 transform hover:scale-105",
                filter === activeFilter 
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg" 
                  : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 text-gray-700 dark:text-gray-200"
              )}
            >
              {filter}
            </Button>
          ))}
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <PortfolioCard key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
