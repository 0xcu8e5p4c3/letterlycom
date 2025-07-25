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
  phone: string;
  subject: string;
  message: string;
  terms: boolean;
};

type FormErrors = {
  name?: string;
  phone?: string;
  subject?: string;
  message?: string;
  terms?: string;
};

export default function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
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
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, terms: checked }));
    
    // Clear error when user checks the box
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

    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
      isValid = false;
    } else if (!/^(\+62|62|0)[0-9]{9,13}$/.test(formData.phone.replace(/\s|-/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Format WhatsApp message
      const whatsappMessage = `*New Contact Form Submission*
      
*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Subject:* ${formData.subject}

*Message:*
${formData.message}`;

      // WhatsApp business number (from contact info)
      const whatsappNumber = '6289529834701'; // +62 895-2983-4701 without spaces/symbols
      
      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // Show success message
      toast({
        title: "Redirecting to WhatsApp!",
        description: "Your message has been prepared and WhatsApp will open shortly.",
      });
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        subject: '',
        message: '',
        terms: false,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem opening WhatsApp. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Get In <span className="text-primary">Touch</span></h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Have a project in mind or want to learn more about our services? Reach out to us!</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div 
            ref={infoRef}
            initial={{ opacity: 0, y: 20 }}
            animate={infoVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-md h-full">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-lg mr-4">
                    <i className="fas fa-map-marker-alt text-primary dark:text-blue-400"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Address</h4>
                    <p className="text-gray-600 dark:text-gray-300">Jl. Tenggilis Utara No.14, Tenggilis Mejoyo, Kec. Tenggilis Mejoyo, Surabaya, Jawa Timur 60292, Indonesia</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-lg mr-4">
                    <i className="fas fa-envelope text-primary dark:text-blue-400"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Email</h4>
                    <p className="text-gray-600 dark:text-gray-300">3130022023@student.unusa.ac.id</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-lg mr-4">
                    <i className="fas fa-phone-alt text-primary dark:text-blue-400"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Phone</h4>
                    <p className="text-gray-600 dark:text-gray-300">+62 895-2983-4701</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-lg mr-4">
                    <i className="fas fa-clock text-primary dark:text-blue-400"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Open</h4>
                    <p className="text-gray-600 dark:text-gray-300">Everyday</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Connect With Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="bg-primary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-lg text-primary dark:text-blue-400 hover:bg-primary hover:text-white transition-all">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="bg-primary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-lg text-primary dark:text-blue-400 hover:bg-primary hover:text-white transition-all">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="bg-primary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-lg text-primary dark:text-blue-400 hover:bg-primary hover:text-white transition-all">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="bg-primary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-lg text-primary dark:text-blue-400 hover:bg-primary hover:text-white transition-all">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            ref={formRef}
            initial={{ opacity: 0, y: 20 }}
            animate={formVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Send Us a Message</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Full Name *
                  </Label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Phone Number *
                  </Label>
                  <Input 
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+62 812-3456-7890"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <Label htmlFor="subject" className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Subject *
                </Label>
                <Input 
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className={errors.subject ? "border-red-500" : ""}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
              </div>
              
              <div className="mb-6">
                <Label htmlFor="message" className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Message *
                </Label>
                <Textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                  rows={5}
                  className={`resize-none ${errors.message ? "border-red-500" : ""}`}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>
              
              <div className="mb-6">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms"
                    checked={formData.terms}
                    onCheckedChange={handleCheckboxChange}
                    className={errors.terms ? "border-red-500" : ""}
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300">
                    I agree to the <a href="#" className="text-primary dark:text-blue-400 hover:underline">Privacy Policy</a> and <a href="#" className="text-primary dark:text-blue-400 hover:underline">Terms of Service</a>.
                  </Label>
                </div>
                {errors.terms && (
                  <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-blue-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span>Opening WhatsApp...</span>
                    <i className="fas fa-spinner fa-spin ml-2"></i>
                  </>
                ) : (
                  <>
                    <i className="fab fa-whatsapp mr-2"></i>
                    Send via WhatsApp
                  </>
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
        </motion.div>
      </div>
    </section>
  );
}