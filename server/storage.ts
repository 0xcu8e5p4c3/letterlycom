import { 
  users, contactSubmissions, siteSettings, siteAssets, heroContent, aboutContent,
  serviceItems, productItems, teamMembers, testimonialItems, portfolioItems, faqItems,
  type User, type InsertUser, type ContactSubmission, type InsertContactSubmission,
  type SiteSetting, type InsertSiteSetting, type SiteAsset, type InsertSiteAsset,
  type HeroContent, type InsertHeroContent, type AboutContent, type InsertAboutContent,
  type ServiceItem, type InsertServiceItem, type ProductItem, type InsertProductItem,
  type TeamMember, type InsertTeamMember, type TestimonialItem, type InsertTestimonialItem,
  type PortfolioItem, type InsertPortfolioItem, type FaqItem, type InsertFaqItem
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";
import { hash, compare } from "bcrypt";

// Storage interface
export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUserPassword(username: string, password: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  
  // Contact submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  getContactSubmission(id: number): Promise<ContactSubmission | undefined>;
  
  // Site settings
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  getAllSiteSettings(): Promise<SiteSetting[]>;
  setSiteSetting(key: string, value: string, type?: string): Promise<SiteSetting>;
  
  // Site assets (images)
  createSiteAsset(asset: InsertSiteAsset): Promise<SiteAsset>;
  getSiteAsset(id: number): Promise<SiteAsset | undefined>;
  getSiteAssetsBySection(section: string): Promise<SiteAsset[]>;
  updateSiteAsset(id: number, asset: Partial<InsertSiteAsset>): Promise<SiteAsset>;
  deleteSiteAsset(id: number): Promise<void>;
  
  // Hero section
  getHeroContent(): Promise<HeroContent | undefined>;
  updateHeroContent(content: Partial<InsertHeroContent>): Promise<HeroContent>;
  
  // About section
  getAboutContent(): Promise<AboutContent | undefined>;
  updateAboutContent(content: Partial<InsertAboutContent>): Promise<AboutContent>;
  
  // Services section
  getServiceItems(): Promise<ServiceItem[]>;
  getServiceItem(id: number): Promise<ServiceItem | undefined>;
  createServiceItem(item: InsertServiceItem): Promise<ServiceItem>;
  updateServiceItem(id: number, item: Partial<InsertServiceItem>): Promise<ServiceItem>;
  deleteServiceItem(id: number): Promise<void>;
  
  // Products section
  getProductItems(): Promise<ProductItem[]>;
  getProductItem(id: number): Promise<ProductItem | undefined>;
  createProductItem(item: InsertProductItem): Promise<ProductItem>;
  updateProductItem(id: number, item: Partial<InsertProductItem>): Promise<ProductItem>;
  deleteProductItem(id: number): Promise<void>;
  
  // Team section
  getTeamMembers(): Promise<TeamMember[]>;
  getTeamMember(id: number): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember>;
  deleteTeamMember(id: number): Promise<void>;
  
  // Testimonials section
  getTestimonialItems(): Promise<TestimonialItem[]>;
  getTestimonialItem(id: number): Promise<TestimonialItem | undefined>;
  createTestimonialItem(item: InsertTestimonialItem): Promise<TestimonialItem>;
  updateTestimonialItem(id: number, item: Partial<InsertTestimonialItem>): Promise<TestimonialItem>;
  deleteTestimonialItem(id: number): Promise<void>;
  
  // Portfolio section
  getPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItem(id: number): Promise<PortfolioItem | undefined>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  updatePortfolioItem(id: number, item: Partial<InsertPortfolioItem>): Promise<PortfolioItem>;
  deletePortfolioItem(id: number): Promise<void>;
  
  // FAQ section
  getFaqItems(): Promise<FaqItem[]>;
  getFaqItem(id: number): Promise<FaqItem | undefined>;
  createFaqItem(item: InsertFaqItem): Promise<FaqItem>;
  updateFaqItem(id: number, item: Partial<InsertFaqItem>): Promise<FaqItem>;
  deleteFaqItem(id: number): Promise<void>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await hash(insertUser.password, 10);
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword
      })
      .returning();
    return user;
  }

  async validateUserPassword(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    
    if (!user) {
      return null;
    }
    
    const isValid = await compare(password, user.password);
    
    if (!isValid) {
      return null;
    }
    
    return user;
  }

  // Contact submissions
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [contactSubmission] = await db
      .insert(contactSubmissions)
      .values(submission)
      .returning();
    return contactSubmission;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  async getContactSubmission(id: number): Promise<ContactSubmission | undefined> {
    const [submission] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id));
    return submission || undefined;
  }
  
  // Site settings
  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting || undefined;
  }
  
  async getAllSiteSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings);
  }
  
  async setSiteSetting(key: string, value: string, type: string = "text"): Promise<SiteSetting> {
    const existing = await this.getSiteSetting(key);
    
    if (existing) {
      const [updated] = await db
        .update(siteSettings)
        .set({ value, type, updatedAt: new Date() })
        .where(eq(siteSettings.key, key))
        .returning();
      return updated;
    } else {
      const [setting] = await db
        .insert(siteSettings)
        .values({ key, value, type })
        .returning();
      return setting;
    }
  }
  
  // Site assets (images)
  async createSiteAsset(asset: InsertSiteAsset): Promise<SiteAsset> {
    const [newAsset] = await db
      .insert(siteAssets)
      .values(asset)
      .returning();
    return newAsset;
  }
  
  async getSiteAsset(id: number): Promise<SiteAsset | undefined> {
    const [asset] = await db.select().from(siteAssets).where(eq(siteAssets.id, id));
    return asset || undefined;
  }
  
  async getSiteAssetsBySection(section: string): Promise<SiteAsset[]> {
    return await db.select().from(siteAssets).where(eq(siteAssets.section, section));
  }
  
  async updateSiteAsset(id: number, asset: Partial<InsertSiteAsset>): Promise<SiteAsset> {
    const [updated] = await db
      .update(siteAssets)
      .set({ ...asset, updatedAt: new Date() })
      .where(eq(siteAssets.id, id))
      .returning();
    return updated;
  }
  
  async deleteSiteAsset(id: number): Promise<void> {
    await db.delete(siteAssets).where(eq(siteAssets.id, id));
  }
  
  // Hero section
  async getHeroContent(): Promise<HeroContent | undefined> {
    const [content] = await db.select().from(heroContent);
    return content || undefined;
  }
  
  async updateHeroContent(content: Partial<InsertHeroContent>): Promise<HeroContent> {
    const existing = await this.getHeroContent();
    
    if (existing) {
      const [updated] = await db
        .update(heroContent)
        .set({ ...content, updatedAt: new Date() })
        .where(eq(heroContent.id, existing.id))
        .returning();
      return updated;
    } else {
      const [newContent] = await db
        .insert(heroContent)
        .values({ 
          title: content.title || "Welcome to Our Company", 
          subtitle: content.subtitle,
          description: content.description,
          buttonText: content.buttonText,
          buttonLink: content.buttonLink,
          imageId: content.imageId
        })
        .returning();
      return newContent;
    }
  }
  
  // About section
  async getAboutContent(): Promise<AboutContent | undefined> {
    const [content] = await db.select().from(aboutContent);
    return content || undefined;
  }
  
  async updateAboutContent(content: Partial<InsertAboutContent>): Promise<AboutContent> {
    const existing = await this.getAboutContent();
    
    if (existing) {
      const [updated] = await db
        .update(aboutContent)
        .set({ ...content, updatedAt: new Date() })
        .where(eq(aboutContent.id, existing.id))
        .returning();
      return updated;
    } else {
      const [newContent] = await db
        .insert(aboutContent)
        .values({ 
          title: content.title || "About Our Company", 
          subtitle: content.subtitle,
          description: content.description,
          content: content.content,
          imageId: content.imageId
        })
        .returning();
      return newContent;
    }
  }
  
  // Services section
  async getServiceItems(): Promise<ServiceItem[]> {
    return await db.select().from(serviceItems).orderBy(asc(serviceItems.order));
  }
  
  async getServiceItem(id: number): Promise<ServiceItem | undefined> {
    const [item] = await db.select().from(serviceItems).where(eq(serviceItems.id, id));
    return item || undefined;
  }
  
  async createServiceItem(item: InsertServiceItem): Promise<ServiceItem> {
    // Get the highest order value
    const items = await this.getServiceItems();
    const maxOrder = items.length > 0 ? Math.max(...items.map(item => item.order)) : 0;
    
    const [newItem] = await db
      .insert(serviceItems)
      .values({
        ...item,
        order: item.order || maxOrder + 1
      })
      .returning();
    return newItem;
  }
  
  async updateServiceItem(id: number, item: Partial<InsertServiceItem>): Promise<ServiceItem> {
    const [updated] = await db
      .update(serviceItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(serviceItems.id, id))
      .returning();
    return updated;
  }
  
  async deleteServiceItem(id: number): Promise<void> {
    await db.delete(serviceItems).where(eq(serviceItems.id, id));
  }
  
  // Products section
  async getProductItems(): Promise<ProductItem[]> {
    return await db.select().from(productItems).orderBy(asc(productItems.order));
  }
  
  async getProductItem(id: number): Promise<ProductItem | undefined> {
    const [item] = await db.select().from(productItems).where(eq(productItems.id, id));
    return item || undefined;
  }
  
  async createProductItem(item: InsertProductItem): Promise<ProductItem> {
    // Get the highest order value
    const items = await this.getProductItems();
    const maxOrder = items.length > 0 ? Math.max(...items.map(item => item.order)) : 0;
    
    const [newItem] = await db
      .insert(productItems)
      .values({
        ...item,
        order: item.order || maxOrder + 1
      })
      .returning();
    return newItem;
  }
  
  async updateProductItem(id: number, item: Partial<InsertProductItem>): Promise<ProductItem> {
    const [updated] = await db
      .update(productItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(productItems.id, id))
      .returning();
    return updated;
  }
  
  async deleteProductItem(id: number): Promise<void> {
    await db.delete(productItems).where(eq(productItems.id, id));
  }
  
  // Team section
  async getTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).orderBy(asc(teamMembers.order));
  }
  
  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
    return member || undefined;
  }
  
  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    // Get the highest order value
    const members = await this.getTeamMembers();
    const maxOrder = members.length > 0 ? Math.max(...members.map(member => member.order)) : 0;
    
    const [newMember] = await db
      .insert(teamMembers)
      .values({
        ...member,
        order: member.order || maxOrder + 1
      })
      .returning();
    return newMember;
  }
  
  async updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember> {
    const [updated] = await db
      .update(teamMembers)
      .set({ ...member, updatedAt: new Date() })
      .where(eq(teamMembers.id, id))
      .returning();
    return updated;
  }
  
  async deleteTeamMember(id: number): Promise<void> {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }
  
  // Testimonials section
  async getTestimonialItems(): Promise<TestimonialItem[]> {
    return await db.select().from(testimonialItems).orderBy(asc(testimonialItems.order));
  }
  
  async getTestimonialItem(id: number): Promise<TestimonialItem | undefined> {
    const [item] = await db.select().from(testimonialItems).where(eq(testimonialItems.id, id));
    return item || undefined;
  }
  
  async createTestimonialItem(item: InsertTestimonialItem): Promise<TestimonialItem> {
    // Get the highest order value
    const items = await this.getTestimonialItems();
    const maxOrder = items.length > 0 ? Math.max(...items.map(item => item.order)) : 0;
    
    const [newItem] = await db
      .insert(testimonialItems)
      .values({
        ...item,
        order: item.order || maxOrder + 1
      })
      .returning();
    return newItem;
  }
  
  async updateTestimonialItem(id: number, item: Partial<InsertTestimonialItem>): Promise<TestimonialItem> {
    const [updated] = await db
      .update(testimonialItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(testimonialItems.id, id))
      .returning();
    return updated;
  }
  
  async deleteTestimonialItem(id: number): Promise<void> {
    await db.delete(testimonialItems).where(eq(testimonialItems.id, id));
  }
  
  // Portfolio section
  async getPortfolioItems(): Promise<PortfolioItem[]> {
    return await db.select().from(portfolioItems).orderBy(asc(portfolioItems.order));
  }
  
  async getPortfolioItem(id: number): Promise<PortfolioItem | undefined> {
    const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    return item || undefined;
  }
  
  async createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    // Get the highest order value
    const items = await this.getPortfolioItems();
    const maxOrder = items.length > 0 ? Math.max(...items.map(item => item.order)) : 0;
    
    const [newItem] = await db
      .insert(portfolioItems)
      .values({
        ...item,
        order: item.order || maxOrder + 1
      })
      .returning();
    return newItem;
  }
  
  async updatePortfolioItem(id: number, item: Partial<InsertPortfolioItem>): Promise<PortfolioItem> {
    const [updated] = await db
      .update(portfolioItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(portfolioItems.id, id))
      .returning();
    return updated;
  }
  
  async deletePortfolioItem(id: number): Promise<void> {
    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
  }
  
  // FAQ section
  async getFaqItems(): Promise<FaqItem[]> {
    return await db.select().from(faqItems).orderBy(asc(faqItems.order));
  }
  
  async getFaqItem(id: number): Promise<FaqItem | undefined> {
    const [item] = await db.select().from(faqItems).where(eq(faqItems.id, id));
    return item || undefined;
  }
  
  async createFaqItem(item: InsertFaqItem): Promise<FaqItem> {
    // Get the highest order value
    const items = await this.getFaqItems();
    const maxOrder = items.length > 0 ? Math.max(...items.map(item => item.order)) : 0;
    
    const [newItem] = await db
      .insert(faqItems)
      .values({
        ...item,
        order: item.order || maxOrder + 1
      })
      .returning();
    return newItem;
  }
  
  async updateFaqItem(id: number, item: Partial<InsertFaqItem>): Promise<FaqItem> {
    const [updated] = await db
      .update(faqItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(faqItems.id, id))
      .returning();
    return updated;
  }
  
  async deleteFaqItem(id: number): Promise<void> {
    await db.delete(faqItems).where(eq(faqItems.id, id));
  }
}

export const storage = new DatabaseStorage();
