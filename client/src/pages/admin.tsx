import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Admin components
import GeneralSettings from "@/components/admin/general-settings";
import HeroSection from "@/components/admin/hero-section";
import AboutSection from "@/components/admin/about-section";
import ServicesSection from "@/components/admin/services-section";
import ProductsSection from "@/components/admin/products-section";
import TeamSection from "@/components/admin/team-section";
import ContactSubmissions from "@/components/admin/contact-submissions";

export default function AdminPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setLocation("/admin-login");
          toast({
            title: "Authentication required",
            description: "Please login to access the admin panel",
            variant: "destructive",
          });
        }
      } catch (error) {
        setLocation("/admin-login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setLocation, toast]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      if (response.ok) {
        setLocation("/admin-login");
        toast({
          title: "Logged out",
          description: "You have been logged out successfully",
        });
      } else {
        throw new Error("Failed to logout");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Welcome to the Admin Panel</CardTitle>
            <CardDescription>
              Manage your website content, settings, and view submitted contact forms
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>

            <TabsTrigger value="contact">Submissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <GeneralSettings />
          </TabsContent>
          
          <TabsContent value="hero" className="space-y-4">
            <HeroSection />
          </TabsContent>
          
          <TabsContent value="about" className="space-y-4">
            <AboutSection />
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4">
            <ServicesSection />
          </TabsContent>
          
          <TabsContent value="products" className="space-y-4">
            <ProductsSection />
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <TeamSection />
          </TabsContent>
          

          
          <TabsContent value="contact" className="space-y-4">
            <ContactSubmissions />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}