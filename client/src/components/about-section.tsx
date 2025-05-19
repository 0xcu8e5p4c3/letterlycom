import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

type TimelineItem = {
  year: string;
  title: string;
  description: string;
  icon: string;
};

const timelineItems: TimelineItem[] = [
  {
    year: "1",
    icon: "fa-search",
    title: "Pilih Paket",
    description: "Telusuri dan pilih paket Letterly yang sesuai dengan kebutuhan organisasi Anda.",
  },
  {
    year: "2",
    icon: "fa-file-signature",
    title: "Kustomisasi",
    description: "Pilih fitur tambahan dan desain yang Anda inginkan, sesuai kebutuhan.",
  },
  {
    year: "3",
    icon: "fa-envelope",
    title: "Isi Formulir",
    description: "Lengkapi formulir pemesanan dan data organisasi Anda.",
  },
  {
    year: "4",
    icon: "fa-paper-plane",
    title: "Konfirmasi & Aktivasi",
    description: "Setelah pembayaran dan konfirmasi, aplikasi Anda siap digunakan.",
  }
];

export default function AboutSection() {
  const { ref: textRef, isVisible: textVisible } = useScrollAnimation();
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation({ delay: 200 });
  const { ref: timelineRef, isVisible: timelineVisible } = useScrollAnimation({ delay: 400 });

  return (
    <section id="about" className="py-20 md:py-32 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={textRef}
          initial={{ opacity: 0, y: 20 }}
          animate={textVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            About <span className="text-primary">Us</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Learn about our journey, mission, and what drives us to create exceptional digital experiences.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          <motion.div 
            ref={textRef}
            initial={{ opacity: 0, y: 20 }}
            animate={textVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Our Story</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Letterly merupakan startup digital yang bergerak dalam bidang pengembangan perangkat lunak, khususnya aplikasi administrasi surat-menyurat berbasis website. Produk utama berupa aplikasi "Letterly" yang menawarkan layanan hak pakai aplikasi kepada organisasi profit maupun non-profit, dengan berbagai fitur seperti pengarsipan digital, nomor surat otomatis, template surat, serta tanda tangan digital. Usaha ini didirikan oleh tim mahasiswa dengan struktur organisasi profesional, mulai dari CEO hingga CFO, dan mengadopsi model bisnis SaaS (Software as a Service) dengan sistem langganan tahunan.
            </p>
            <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Our Mission</h3>
            <ul className="text-gray-600 dark:text-gray-300 list-decimal pl-5 space-y-2">
              <li>
                Menyederhanakan proses administrasi surat-menyurat dengan menghadirkan solusi digital yang efisien, aman, dan mudah digunakan bagi berbagai jenis organisasi.
              </li>
              <li>
                Mendukung transformasi digital di sektor pemerintahan, pendidikan, dan swasta melalui teknologi surat digital yang terstandarisasi dan terintegrasi.
              </li>
              <li>
                Menyediakan layanan aplikasi yang dapat disesuaikan (customizable) sesuai kebutuhan pengguna, baik dari sisi fitur maupun desain, untuk menjamin fleksibilitas dan kepuasan pelanggan.
              </li>
            </ul>
          </motion.div>
          
          <motion.div 
            ref={imageRef}
            initial={{ opacity: 0, y: 20 }}
            animate={imageVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80" 
              alt="Team collaborating in meeting room" 
              className="w-full h-auto rounded-2xl shadow-lg" 
            />
          </motion.div>
        </div>
        
        {/* Improved Timeline */}
        <motion.div 
          ref={timelineRef}
          initial={{ opacity: 0, y: 20 }}
          animate={timelineVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="relative"
        >
          <h3 className="text-2xl md:text-3xl font-semibold mb-12 text-center text-gray-900 dark:text-white">
            Cara Bergabung Bersama Kami
          </h3>
          
          {/* Mobile Timeline */}
          <div className="block md:hidden">
            <div className="relative">
              {/* Timeline line for mobile */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent"></div>
              
              {timelineItems.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={timelineVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 * index }}
                  className="relative mb-12 last:mb-0"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-3 top-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">{item.year}</span>
                  </div>
                  
                  {/* Content card */}
                  <div className="ml-16 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                        <i className={`fas ${item.icon} text-primary`}></i>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Desktop Timeline */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Timeline line for desktop */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent transform -translate-x-1/2"></div>
              
              {timelineItems.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={timelineVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 * index }}
                  className="relative mb-16 last:mb-0"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 top-6 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg transform -translate-x-1/2 z-10">
                    <i className={`fas ${item.icon} text-white text-lg`}></i>
                  </div>
                  
                  {/* Content positioned alternately */}
                  <div className={`flex items-center ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                      <motion.div 
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl"
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-primary font-bold text-lg">{item.year}</span>
                          </div>
                          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Custom CSS for additional styling */}
      <style jsx>{`
        .timeline-gradient-line::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, #3b82f6, rgba(59, 130, 246, 0.5), transparent);
          transform: translateX(-50%);
        }
      `}</style>
    </section>
  );
}