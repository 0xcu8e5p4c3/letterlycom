import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQ = {
  question: string;
  answer: string;
  delay: number;
};

const faqs: FAQ[] = [
  {
    question: "Apa itu Letterly?",
    answer: "Letterly adalah aplikasi administrasi surat-menyurat yang dapat disesuaikan (customizable) sesuai kebutuhan pengguna. Aplikasi ini dirancang untuk membantu pengelolaan dokumen dan surat secara efisien dalam lingkungan organisasi atau perusahaan.",
    delay: 100
  },
  {
    question: "Apa yang membedakan Letterly dari sistem surat lainnya?",
    answer: "Letterly menawarkan fleksibilitas tinggi melalui paket fitur yang dapat dipilih sesuai kebutuhan, serta opsi kustomisasi desain dan penambahan fitur khusus. Dengan begitu, aplikasi bisa disesuaikan dengan alur kerja dan identitas visual instansi Anda.",
    delay: 200
  },
  {
    question: "Bagaimana sistem lisensi Letterly bekerja?",
    answer: "Letterly menggunakan sistem lisensi tahunan. Anda cukup menyewa aplikasi ini untuk jangka waktu satu tahun, dan dapat diperpanjang di tahun-tahun berikutnya. Selama masa sewa, Anda juga akan mendapatkan dukungan dan pembaruan sistem.",
    delay: 300
  },
  {
    question: "Apakah saya bisa meminta fitur atau desain khusus?",
    answer: "Tentu saja. Letterly mendukung kustomisasi penuh, termasuk penambahan fitur khusus, pengaturan alur kerja, serta desain antarmuka yang disesuaikan dengan kebutuhan dan identitas organisasi Anda.",
    delay: 400
  },
  {
    question: "Apa saja paket yang tersedia?",
    answer: "Kami menyediakan beberapa pilihan paket dengan fitur yang berbeda-beda, mulai dari paket dasar hingga paket lengkap dengan fitur lanjutan. Anda juga dapat menambahkan fitur opsional atau melakukan kustomisasi desain sesuai permintaan.",
    delay: 500
  },
  {
    question: "Bagaimana alur pemesanan aplikasi Letterly?",
    answer: "Langkah-langkahnya: (1) Pilih paket yang sesuai, (2) Tentukan tambahan fitur atau desain khusus, (3) Kami akan membuatkan proposal dan penawaran, (4) Setelah disetujui, proses pengembangan akan dimulai hingga aplikasi siap digunakan.",
    delay: 600
  },
  {
    question: "Apakah tersedia pelatihan dan dukungan teknis?",
    answer: "Ya, setiap langganan Letterly mencakup pelatihan penggunaan aplikasi dan dukungan teknis selama masa sewa. Kami siap membantu Anda dalam penggunaan maupun jika ada kendala teknis.",
    delay: 700
  },
  {
    question: "Apakah data saya aman di Letterly?",
    answer: "Keamanan data adalah prioritas utama kami. Letterly menggunakan teknologi enkripsi modern, kontrol akses, serta infrastruktur cloud yang aman. Kami juga menyediakan opsi instalasi lokal (on-premise) jika dibutuhkan.",
    delay: 800
  },
  {
    question: "Bisakah Letterly diintegrasikan dengan sistem lain?",
    answer: "Ya, Letterly dapat diintegrasikan dengan sistem lain seperti HR, ERP, atau email perusahaan Anda melalui API atau pengembangan khusus sesuai kebutuhan integrasi Anda.",
    delay: 900
  }

];

export default function FAQSection() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();

  return (
    <section id="faq" className="py-20 md:py-32 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Frequently Asked <span className="text-primary">Questions</span></h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Find answers to common questions about our services and process.</p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-6">
            {faqs.map((faq, index) => {
              const { ref, isVisible } = useScrollAnimation({ delay: faq.delay });
              
              return (
                <motion.div 
                  key={index}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: faq.delay / 1000 }}
                >
                  <AccordionItem value={`item-${index}`} className="bg-white dark:bg-gray-900 rounded-xl shadow-md border-none">
                    <AccordionTrigger className="px-6 py-4 text-lg font-medium text-gray-900 dark:text-white hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
