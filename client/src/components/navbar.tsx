import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/products', label: 'Products' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
];

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeSheet = () => setIsSheetOpen(false);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all backdrop-blur-sm",
      isScrolled ? "bg-white/90 dark:bg-gray-950/90 shadow-sm" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 py-4 md:py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-primary dark:text-blue-400 text-2xl">
            <img src="https://raw.githubusercontent.com/0xcu8e5p4c3/S-P/main/img/letterly.png" alt="Logo Letterly" className="w-10 h-auto" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Letterly Company</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <Link 
              key={link.href}
              href={link.href}
              className={cn(
                "font-medium transition-all",
                location === link.href 
                  ? "text-primary dark:text-blue-400" 
                  : "text-gray-900 dark:text-white hover:text-primary dark:hover:text-blue-400"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          {/* Dark mode toggle */}
          <Button
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="h-5 w-5 text-yellow-300" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {/* Mobile menu button */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pt-20 w-full sm:max-w-sm">
              <div className="absolute top-4 right-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsSheetOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-col space-y-6">
                {navLinks.map(link => (
                  <Link 
                    key={link.href}
                    href={link.href}
                    onClick={closeSheet}
                    className={cn(
                      "text-2xl font-medium transition-all",
                      location === link.href 
                        ? "text-primary dark:text-blue-400" 
                        : "text-gray-900 dark:text-white hover:text-primary dark:hover:text-blue-400"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button 
                  onClick={() => {
                    closeSheet();
                    window.location.href = '/contact';
                  }}
                  className="mt-4 w-full"
                >
                  Get Started
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
          
          {/* CTA button */}
          <Link href="/contact">
            <Button className="hidden md:flex bg-primary hover:bg-blue-600 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
