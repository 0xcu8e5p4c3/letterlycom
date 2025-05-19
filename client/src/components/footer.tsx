import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="text-primary dark:text-blue-400 text-2xl">
                <img src="https://raw.githubusercontent.com/0xcu8e5p4c3/S-P/main/img/letterly.png" alt="Logo Letterly" className="w-10 h-auto" />
              </div>
              <span className="text-xl font-bold text-white">Letterly Company</span>
            </Link>
            
            <p className="text-gray-400 mb-6">
              Letterly merupakan startup digital yang bergerak dalam bidang pengembangan perangkat lunak, khususnya aplikasi administrasi surat-menyurat berbasis website.
            </p>
            
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary dark:hover:text-blue-400 p-0">
                <i className="fab fa-facebook-f"></i>
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary dark:hover:text-blue-400 p-0">
                <i className="fab fa-twitter"></i>
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary dark:hover:text-blue-400 p-0">
                <i className="fab fa-linkedin-in"></i>
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary dark:hover:text-blue-400 p-0">
                <i className="fab fa-instagram"></i>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-all">Home</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-all">About Us</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-all">Services</Link></li>
              <li><Link href="/portfolio" className="text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-all">Portfolio</Link></li>
              <li><Link href="/testimonials" className="text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-all">Testimonials</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-all">Contact</Link></li>
            </ul>
          </div>
        
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt text-primary dark:text-blue-400 mt-1 mr-3"></i>
                <span className="text-gray-400">Everywhere</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-envelope text-primary dark:text-blue-400 mt-1 mr-3"></i>
                <span className="text-gray-400">3130022022@student.unusa.ac.id</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone-alt text-primary dark:text-blue-400 mt-1 mr-3"></i>
                <span className="text-gray-400">+62 896-1226-5513</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-clock text-primary dark:text-blue-400 mt-1 mr-3"></i>
                <span className="text-gray-400">Everyday</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Letterly. All rights reserved.
            </p>
            
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-all text-sm">Privacy Policy</Link>
              <Link href="#" className="text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-all text-sm">Terms of Service</Link>
              <Link href="#" className="text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-all text-sm">Cookie Policy</Link>
              <Link href="/admin-login" className="text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-all text-sm">Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
