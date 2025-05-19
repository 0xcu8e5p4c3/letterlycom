import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

// Middleware to check if user is authenticated and is admin
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.user || req.session.user.role !== 'admin') {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      // Only allow registration if there are no users yet (first admin setup)
      const users = await storage.getAllUsers();
      
      if (users.length > 0) {
        return res.status(403).json({ message: "Registration is closed" });
      }
      
      const userData = insertUserSchema.parse({
        ...req.body,
        role: 'admin' // First user is always admin
      });
      
      const user = await storage.createUser(userData);
      
      // Set user in session
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role
      };

      // Don't return the password in the response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({
        message: 'User registered successfully',
        user: userWithoutPassword
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid user data', 
          errors: error.errors 
        });
      }
      
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Failed to register user' });
    }
  });
  
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.validateUserPassword(username, password);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user in session
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role
      };
      
      // Don't return the password in the response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        message: 'Logged in successfully',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Failed to login' });
    }
  });
  
  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Error logging out:', err);
        return res.status(500).json({ message: 'Failed to logout' });
      }
      
      res.json({ message: 'Logged out successfully' });
    });
  });
  
  app.get('/api/auth/check', (req, res) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    res.json({
      authenticated: true,
      user: req.session.user
    });
  });

  // Contact form routes
  app.post('/api/contact', async (req, res) => {
    try {
      // Validate the request body
      const contactData = contactSchema.parse(req.body);
      
      // Store the contact form submission
      const submission = await storage.createContactSubmission(contactData);
      
      res.status(201).json({
        message: 'Message sent successfully',
        submissionId: submission.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid form data', 
          errors: error.errors 
        });
      }
      
      console.error('Error submitting contact form:', error);
      res.status(500).json({ message: 'Failed to send message' });
    }
  });

  // Admin protected routes
  app.get('/api/contact', isAdmin, async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      res.status(500).json({ message: 'Failed to fetch submissions' });
    }
  });
  
  // Site Settings
  app.get('/api/settings', async (req, res) => {
    try {
      const settings = await storage.getAllSiteSettings();
      res.json(settings);
    } catch (error) {
      console.error('Error fetching site settings:', error);
      res.status(500).json({ message: 'Failed to fetch settings' });
    }
  });
  
  app.post('/api/settings', isAdmin, async (req, res) => {
    try {
      const { key, value, type } = req.body;
      
      if (!key || value === undefined) {
        return res.status(400).json({ message: "Key and value are required" });
      }
      
      const setting = await storage.setSiteSetting(key, value, type);
      res.json(setting);
    } catch (error) {
      console.error('Error setting site setting:', error);
      res.status(500).json({ message: 'Failed to update setting' });
    }
  });
  
  // Content Management Routes
  
  // Hero Content
  app.get('/api/content/hero', async (req, res) => {
    try {
      const content = await storage.getHeroContent();
      res.json(content || {});
    } catch (error) {
      console.error('Error fetching hero content:', error);
      res.status(500).json({ message: 'Failed to fetch hero content' });
    }
  });
  
  app.post('/api/content/hero', isAdmin, async (req, res) => {
    try {
      const content = await storage.updateHeroContent(req.body);
      res.json(content);
    } catch (error) {
      console.error('Error updating hero content:', error);
      res.status(500).json({ message: 'Failed to update hero content' });
    }
  });
  
  // About Content
  app.get('/api/content/about', async (req, res) => {
    try {
      const content = await storage.getAboutContent();
      res.json(content || {});
    } catch (error) {
      console.error('Error fetching about content:', error);
      res.status(500).json({ message: 'Failed to fetch about content' });
    }
  });
  
  app.post('/api/content/about', isAdmin, async (req, res) => {
    try {
      const content = await storage.updateAboutContent(req.body);
      res.json(content);
    } catch (error) {
      console.error('Error updating about content:', error);
      res.status(500).json({ message: 'Failed to update about content' });
    }
  });
  
  // Services
  app.get('/api/content/services', async (req, res) => {
    try {
      const services = await storage.getServiceItems();
      res.json(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({ message: 'Failed to fetch services' });
    }
  });
  
  app.post('/api/content/services', isAdmin, async (req, res) => {
    try {
      const service = await storage.createServiceItem(req.body);
      res.status(201).json(service);
    } catch (error) {
      console.error('Error creating service:', error);
      res.status(500).json({ message: 'Failed to create service' });
    }
  });
  
  app.put('/api/content/services/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.updateServiceItem(id, req.body);
      res.json(service);
    } catch (error) {
      console.error('Error updating service:', error);
      res.status(500).json({ message: 'Failed to update service' });
    }
  });
  
  app.delete('/api/content/services/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteServiceItem(id);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting service:', error);
      res.status(500).json({ message: 'Failed to delete service' });
    }
  });
  
  // Products
  app.get('/api/content/products', async (req, res) => {
    try {
      const products = await storage.getProductItems();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  });
  
  app.post('/api/content/products', isAdmin, async (req, res) => {
    try {
      const product = await storage.createProductItem(req.body);
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Failed to create product' });
    }
  });
  
  app.put('/api/content/products/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.updateProductItem(id, req.body);
      res.json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Failed to update product' });
    }
  });
  
  app.delete('/api/content/products/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProductItem(id);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Failed to delete product' });
    }
  });
  
  // Team Members
  app.get('/api/content/team', async (req, res) => {
    try {
      const members = await storage.getTeamMembers();
      res.json(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
      res.status(500).json({ message: 'Failed to fetch team members' });
    }
  });
  
  app.post('/api/content/team', isAdmin, async (req, res) => {
    try {
      const member = await storage.createTeamMember(req.body);
      res.status(201).json(member);
    } catch (error) {
      console.error('Error creating team member:', error);
      res.status(500).json({ message: 'Failed to create team member' });
    }
  });
  
  app.put('/api/content/team/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const member = await storage.updateTeamMember(id, req.body);
      res.json(member);
    } catch (error) {
      console.error('Error updating team member:', error);
      res.status(500).json({ message: 'Failed to update team member' });
    }
  });
  
  app.delete('/api/content/team/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTeamMember(id);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting team member:', error);
      res.status(500).json({ message: 'Failed to delete team member' });
    }
  });
  
  // Testimonials
  app.get('/api/content/testimonials', async (req, res) => {
    try {
      const testimonials = await storage.getTestimonialItems();
      res.json(testimonials);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      res.status(500).json({ message: 'Failed to fetch testimonials' });
    }
  });
  
  app.post('/api/content/testimonials', isAdmin, async (req, res) => {
    try {
      const testimonial = await storage.createTestimonialItem(req.body);
      res.status(201).json(testimonial);
    } catch (error) {
      console.error('Error creating testimonial:', error);
      res.status(500).json({ message: 'Failed to create testimonial' });
    }
  });
  
  app.put('/api/content/testimonials/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const testimonial = await storage.updateTestimonialItem(id, req.body);
      res.json(testimonial);
    } catch (error) {
      console.error('Error updating testimonial:', error);
      res.status(500).json({ message: 'Failed to update testimonial' });
    }
  });
  
  app.delete('/api/content/testimonials/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTestimonialItem(id);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      res.status(500).json({ message: 'Failed to delete testimonial' });
    }
  });
  
  // Portfolio
  app.get('/api/content/portfolio', async (req, res) => {
    try {
      const portfolioItems = await storage.getPortfolioItems();
      res.json(portfolioItems);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      res.status(500).json({ message: 'Failed to fetch portfolio items' });
    }
  });
  
  app.post('/api/content/portfolio', isAdmin, async (req, res) => {
    try {
      const portfolioItem = await storage.createPortfolioItem(req.body);
      res.status(201).json(portfolioItem);
    } catch (error) {
      console.error('Error creating portfolio item:', error);
      res.status(500).json({ message: 'Failed to create portfolio item' });
    }
  });
  
  app.put('/api/content/portfolio/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const portfolioItem = await storage.updatePortfolioItem(id, req.body);
      res.json(portfolioItem);
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      res.status(500).json({ message: 'Failed to update portfolio item' });
    }
  });
  
  app.delete('/api/content/portfolio/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePortfolioItem(id);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      res.status(500).json({ message: 'Failed to delete portfolio item' });
    }
  });
  
  // FAQ
  app.get('/api/content/faq', async (req, res) => {
    try {
      const faqItems = await storage.getFaqItems();
      res.json(faqItems);
    } catch (error) {
      console.error('Error fetching FAQ items:', error);
      res.status(500).json({ message: 'Failed to fetch FAQ items' });
    }
  });
  
  app.post('/api/content/faq', isAdmin, async (req, res) => {
    try {
      const faqItem = await storage.createFaqItem(req.body);
      res.status(201).json(faqItem);
    } catch (error) {
      console.error('Error creating FAQ item:', error);
      res.status(500).json({ message: 'Failed to create FAQ item' });
    }
  });
  
  app.put('/api/content/faq/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const faqItem = await storage.updateFaqItem(id, req.body);
      res.json(faqItem);
    } catch (error) {
      console.error('Error updating FAQ item:', error);
      res.status(500).json({ message: 'Failed to update FAQ item' });
    }
  });
  
  app.delete('/api/content/faq/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFaqItem(id);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting FAQ item:', error);
      res.status(500).json({ message: 'Failed to delete FAQ item' });
    }
  });
  
  // File upload for images
  app.post('/api/upload', isAdmin, async (req, res) => {
    try {
      const { name, section, contentType, data } = req.body;
      
      if (!name || !section || !contentType || !data) {
        return res.status(400).json({ message: "Missing required file information" });
      }
      
      const asset = await storage.createSiteAsset({
        name,
        section,
        contentType,
        data, // Base64 encoded data
      });
      
      res.status(201).json({
        message: 'File uploaded successfully',
        asset: {
          id: asset.id,
          name: asset.name,
          section: asset.section,
          contentType: asset.contentType,
        }
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Failed to upload file' });
    }
  });
  
  app.get('/api/assets/:section', async (req, res) => {
    try {
      const section = req.params.section;
      const assets = await storage.getSiteAssetsBySection(section);
      
      // Don't return the data in the initial response to reduce response size
      const assetsWithoutData = assets.map(({ data, ...asset }) => asset);
      
      res.json(assetsWithoutData);
    } catch (error) {
      console.error('Error fetching assets:', error);
      res.status(500).json({ message: 'Failed to fetch assets' });
    }
  });
  
  app.get('/api/assets/file/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const asset = await storage.getSiteAsset(id);
      
      if (!asset) {
        return res.status(404).json({ message: 'Asset not found' });
      }
      
      // Send the file data directly
      res.json(asset);
    } catch (error) {
      console.error('Error fetching asset:', error);
      res.status(500).json({ message: 'Failed to fetch asset' });
    }
  });
  
  app.delete('/api/assets/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSiteAsset(id);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting asset:', error);
      res.status(500).json({ message: 'Failed to delete asset' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
