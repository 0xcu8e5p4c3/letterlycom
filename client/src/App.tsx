import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Services from "@/pages/services";
import Products from "@/pages/products";
import Portfolio from "@/pages/portfolio";
import Team from "@/pages/team";
import Contact from "@/pages/contact";
import FAQ from "@/pages/faq";
import AdminLogin from "@/pages/admin-login";
import AdminRegister from "@/pages/admin-register";
import AdminPanel from "@/pages/admin";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useEffect } from "react";
import { ThemeProvider } from "@/contexts/theme-context";

function Router() {
  const [location] = useLocation();
  
  // Determine if we're in the admin section
  const isAdminRoute = location.startsWith("/admin");
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/products" component={Products} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/team" component={Team} />

      <Route path="/contact" component={Contact} />
      <Route path="/faq" component={FAQ} />
      
      {/* Admin routes - specified exact path to avoid routing issues */}
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin-register" component={AdminRegister} />
      <Route path="/admin" component={AdminPanel} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");
  
  // Smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.href && target.href.includes('#')) {
        const href = target.getAttribute('href');
        if (href?.startsWith('#')) {
          e.preventDefault();
          const targetId = href;
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.getBoundingClientRect().top + window.pageYOffset - 80,
              behavior: 'smooth'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {!isAdminRoute && <Navbar />}
        <Toaster />
        <Router />
        {!isAdminRoute && <Footer />}
      </div>
    </ThemeProvider>
  );
}

export default App;
