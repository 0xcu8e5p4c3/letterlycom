import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type FormData = {
  name: string;
  email: string; // nomor whatsapp
  subject: string;
  message: string;
  terms: boolean;
};

type FormErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  terms?: string;
};

export default function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '', // nomor whatsapp
    subject: '',
    message: '',
    terms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation({ delay: 200 });
  const { ref: infoRef, isVisible: infoVisible } = useScrollAnimation({ delay: 100 });
  const { ref: mapRef, isVisible: mapVisible } = useScrollAnimation({ delay: 300 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, terms: checked }));
    if (errors.terms) {
      setErrors(prev => ({ ...prev, terms: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your WhatsApp number';
      isValid = false;
    } else if (!/^\+?\d{8,15}$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid WhatsApp number';
      isValid = false;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Please enter a subject';
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message';
      isValid = false;
    }

    if (!formData.terms) {
      newErrors.terms = 'You must agree to our terms';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // WhatsApp tujuan (ganti sesuai kebutuhan)
    const recipient = '+6281234567890';

    // Buat pesan
    const text = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `WhatsApp: ${formData.email}\n` +
      `Subject: ${formData.subject}\n\n` +
      `${formData.message}`
    );

    // Redirect ke WhatsApp
    const whatsappURL = `https://wa.me/${recipient.replace(/\D/g, '')}?text=${text}`;
    window.open(whatsappURL, '_blank');

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      terms: false,
    });

    toast({
      title: "Redirecting to WhatsApp...",
      description: "Your message will be sent via WhatsApp.",
    });

    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Have a project in mind or want to learn more about our services? Reach out to us!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* INFO KONTAK (tetap sama) */}
          {/* ...kode info seperti sebelumnya... */}

          {/* FORM */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 20 }}
            animate={formVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                Send Us a Message
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="email">WhatsApp Number *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="tel"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="+6281234567890"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="mb-6">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className={errors.subject ? "border-red-500" : ""}
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>

              <div className="mb-6">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                  rows={5}
                  className={`resize-none ${errors.message ? "border-red-500" : ""}`}
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              <div className="mb-6">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.terms}
                    onCheckedChange={handleCheckboxChange}
                    className={errors.terms ? "border-red-500" : ""}
                  />
                  <Label htmlFor="terms">
                    I agree to the <a href="#" className="text-primary hover:underline">Privacy Policy</a> and <a href="#" className="text-primary hover:underline">Terms of Service</a>.
                  </Label>
                </div>
                {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-blue-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span>Sending...</span>
                    <i className="fas fa-spinner fa-spin ml-2"></i>
                  </>
                ) : (
                  'Send Message via WhatsApp'
                )}
              </Button>
            </form>
          </motion.div>
        </div>

        <motion.div
          ref={mapRef}
          initial={{ opacity: 0, y: 20 }}
          animate={mapVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="w-full h-80 rounded-xl overflow-hidden shadow-md"
        >
          {/* Optional: Add map here if needed */}
        </motion.div>
      </div>
    </section>
  );
}
