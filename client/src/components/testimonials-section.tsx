import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Testimonial = {
  content: string;
  author: string;
  position: string;
  company: string;
  image: string;
};

const testimonials: Testimonial[] = [
  {
    content: "InnovateTech transformed our business with their custom CRM solution. Their team was professional, responsive, and delivered beyond our expectations. Our efficiency has improved by 40% since implementation.",
    author: "David Wilson",
    position: "CEO",
    company: "TechNova",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    content: "The e-commerce platform developed by InnovateTech has revolutionized our online presence. Sales have increased by 75% in just six months, and customer feedback has been overwhelmingly positive.",
    author: "Emily Roberts",
    position: "Marketing Director",
    company: "Style Hub",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    content: "Working with InnovateTech on our mobile app was a game-changer. Their attention to detail and user experience expertise resulted in an app that our customers love. Downloads and engagement have exceeded our projections by 50%.",
    author: "James Anderson",
    position: "Product Manager",
    company: "HealthPlus",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
  }
];

export default function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: sliderRef, isVisible: sliderVisible } = useScrollAnimation({ delay: 100 });
  const { ref: dotsRef, isVisible: dotsVisible } = useScrollAnimation({ delay: 200 });

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (trackRef.current) {
      const slideWidth = trackRef.current.parentElement?.clientWidth || 0;
      trackRef.current.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    }
  }, [currentSlide]);

  // Handle window resize for responsive slider
  useEffect(() => {
    const handleResize = () => {
      if (trackRef.current) {
        const slideWidth = trackRef.current.parentElement?.clientWidth || 0;
        trackRef.current.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentSlide]);

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute right-0 bottom-0 w-1/2 h-1/2 opacity-20 dark:opacity-10">
          <div className="w-full h-full bg-blue-500 rounded-full filter blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
        </div>
        <i className="fas fa-quote-right text-9xl text-primary absolute top-10 right-10 opacity-5"></i>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Client <span className="text-primary">Testimonials</span></h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Hear what our clients say about working with us and the results we've delivered.</p>
        </motion.div>
        
        <motion.div 
          ref={sliderRef}
          initial={{ opacity: 0, y: 20 }}
          animate={sliderVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="relative"
        >
          <div className="testimonial-slider overflow-hidden">
            <div 
              ref={trackRef}
              className="testimonial-track flex transition-transform duration-500"
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-slide w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4">
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-md h-full">
                    <div className="text-primary dark:text-blue-400 mb-4">
                      <i className="fas fa-quote-left text-3xl"></i>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-8 italic">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex items-center">
                      <img 
                        src={testimonial.image} 
                        alt={`${testimonial.author} - ${testimonial.position}, ${testimonial.company}`} 
                        className="w-12 h-12 rounded-full object-cover mr-4" 
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.position}, {testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={prevSlide}
            variant="outline" 
            size="icon"
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white dark:bg-gray-900 text-primary dark:text-blue-400 p-3 rounded-full shadow-md hover:bg-primary hover:text-white dark:hover:bg-primary transition-all z-10"
          >
            <i className="fas fa-chevron-left"></i>
          </Button>
          
          <Button 
            onClick={nextSlide}
            variant="outline" 
            size="icon"
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white dark:bg-gray-900 text-primary dark:text-blue-400 p-3 rounded-full shadow-md hover:bg-primary hover:text-white dark:hover:bg-primary transition-all z-10"
          >
            <i className="fas fa-chevron-right"></i>
          </Button>
        </motion.div>
        
        <motion.div 
          ref={dotsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={dotsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="flex justify-center mt-10"
        >
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-colors",
                  index === currentSlide ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                )}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
