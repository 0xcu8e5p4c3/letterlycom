import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  email: true,
  fullName: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Contact submissions schema
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  terms: boolean("terms").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }),
  terms: z.boolean().refine(val => val === true, { message: "You must agree to our terms" }),
});

export const insertContactSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
  terms: true,
});

export type InsertContactSubmission = z.infer<typeof insertContactSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

// Website settings schema
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value"),
  type: text("type").default("text").notNull(), // text, number, boolean, json
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).pick({
  key: true,
  value: true,
  type: true,
});

export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;

// Image assets storage
export const siteAssets = pgTable("site_assets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  section: text("section").notNull(),
  contentType: text("content_type").notNull(),
  data: text("data").notNull(), // Base64 encoded data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSiteAssetSchema = createInsertSchema(siteAssets).pick({
  name: true,
  section: true,
  contentType: true,
  data: true,
});

export type InsertSiteAsset = z.infer<typeof insertSiteAssetSchema>;
export type SiteAsset = typeof siteAssets.$inferSelect;

// Hero section content
export const heroContent = pgTable("hero_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  buttonText: text("button_text"),
  buttonLink: text("button_link"),
  imageId: integer("image_id").references(() => siteAssets.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertHeroContentSchema = createInsertSchema(heroContent).omit({
  id: true,
  updatedAt: true,
});

export type InsertHeroContent = z.infer<typeof insertHeroContentSchema>;
export type HeroContent = typeof heroContent.$inferSelect;

// About section content
export const aboutContent = pgTable("about_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  content: text("content"),
  imageId: integer("image_id").references(() => siteAssets.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAboutContentSchema = createInsertSchema(aboutContent).omit({
  id: true,
  updatedAt: true,
});

export type InsertAboutContent = z.infer<typeof insertAboutContentSchema>;
export type AboutContent = typeof aboutContent.$inferSelect;

// Service items
export const serviceItems = pgTable("service_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon"),
  order: integer("order").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertServiceItemSchema = createInsertSchema(serviceItems).omit({
  id: true,
  updatedAt: true,
});

export type InsertServiceItem = z.infer<typeof insertServiceItemSchema>;
export type ServiceItem = typeof serviceItems.$inferSelect;

// Product items
export const productItems = pgTable("product_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price"),
  features: text("features"), // Stored as JSON string
  bgColor: text("bg_color").default("#ffffff"),
  buttonColor: text("button_color").default("#000000"),
  imageId: integer("image_id").references(() => siteAssets.id),
  order: integer("order").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProductItemSchema = createInsertSchema(productItems).omit({
  id: true,
  updatedAt: true,
});

export type InsertProductItem = z.infer<typeof insertProductItemSchema>;
export type ProductItem = typeof productItems.$inferSelect;

// Team members
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio"),
  socialLinks: jsonb("social_links"), // JSON object with social links
  imageId: integer("image_id").references(() => siteAssets.id),
  order: integer("order").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  updatedAt: true,
});

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

// Testimonial items
export const testimonialItems = pgTable("testimonial_items", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  position: text("position"),
  company: text("company"),
  imageId: integer("image_id").references(() => siteAssets.id),
  order: integer("order").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTestimonialItemSchema = createInsertSchema(testimonialItems).omit({
  id: true,
  updatedAt: true,
});

export type InsertTestimonialItem = z.infer<typeof insertTestimonialItemSchema>;
export type TestimonialItem = typeof testimonialItems.$inferSelect;

// Portfolio items
export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"),
  imageId: integer("image_id").references(() => siteAssets.id),
  order: integer("order").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({
  id: true,
  updatedAt: true,
});

export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type PortfolioItem = typeof portfolioItems.$inferSelect;

// FAQ items
export const faqItems = pgTable("faq_items", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  order: integer("order").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFaqItemSchema = createInsertSchema(faqItems).omit({
  id: true,
  updatedAt: true,
});

export type InsertFaqItem = z.infer<typeof insertFaqItemSchema>;
export type FaqItem = typeof faqItems.$inferSelect;
