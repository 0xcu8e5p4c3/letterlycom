import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Link } from 'wouter';

type Service = {
  icon: string;
  title: string;
  description: string;
  delay: number;
};

const services: Service[] = [
  {
    icon: 'fa-laptop-code',
    title: 'Web Development',
    description: 'Custom, responsive websites and web applications built with modern technologies and best practices.',
    delay: 0
  },
  {
    icon: 'fa-mobile-alt',
    title: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications that deliver exceptional user experiences.',
    delay: 100
  },
  {
    icon: 'fa-paint-brush',
    title: 'UI/UX Design',
    description: 'User-centered design that balances aesthetics with functionality to create intuitive interfaces.',
    delay: 200
  },
  {
    icon: 'fa-chart-line',
    title: 'Digital Marketing',
    description: 'Strategic marketing solutions to increase your online visibility, traffic, and conversions.',
    delay: 300
  },
  {
    icon: 'fa-server',
    title: 'Cloud Solutions',
    description: 'Scalable, secure cloud infrastructure and services optimized for your business needs.',
    delay: 400
  },
  {
    icon: 'fa-robot',
    title: 'AI & Machine Learning',
    description: 'Innovative AI solutions that automate processes and provide valuable insights from your data.',
    delay: 500
  }
];

export default function ServicesSection() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();

  return (
    <section id="services" className="py-20 md:py-32 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Our <span className="text-primary">Services</span></h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">We offer a comprehensive range of digital solutions to help your business thrive in the digital world.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const { ref, isVisible } = useScrollAnimation({ delay: service.delay });
            
            return (
              <motion.div 
                key={index}
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: service.delay / 1000 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl p-8 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-primary dark:text-blue-400 text-3xl mb-4">
                  <i className={`fas ${service.icon}`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{service.description}</p>
                <Link href="/contact" className="text-primary dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-medium inline-flex items-center transition-all">
                  Learn more <i className="fas fa-arrow-right ml-2 text-sm"></i>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
