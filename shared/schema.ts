import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const websites = pgTable("websites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  generatedHtml: text("generated_html").notNull(),
  generatedCss: text("generated_css").notNull(),
  navigationItems: text("navigation_items").array(),
  footerContent: text("footer_content"),
  includeNavigation: boolean("include_navigation").default(true),
  includeFooter: boolean("include_footer").default(true),
  includeContactForm: boolean("include_contact_form").default(false),
  isResponsive: boolean("is_responsive").default(true),
  primaryColor: text("primary_color").default("#667eea"),
  secondaryColor: text("secondary_color").default("#764ba2"),
  imageUrls: text("image_urls").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWebsiteSchema = createInsertSchema(websites).omit({
  id: true,
  createdAt: true,
  generatedHtml: true,
  generatedCss: true,
  navigationItems: true,
  footerContent: true,
});

export const websiteGenerationSchema = z.object({
  name: z.string().min(1, "Website name is required"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  includeNavigation: z.boolean().default(true),
  includeFooter: z.boolean().default(true),
  includeContactForm: z.boolean().default(false),
  isResponsive: z.boolean().default(true),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color").default("#667eea"),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color").default("#764ba2"),
  imageUrls: z.array(z.string().url("Must be a valid URL")).default([]),
  styleTemplate: z.enum(["modern", "classic", "minimal", "corporate", "creative"]).default("modern"),
});

export const stylePreviewSchema = z.object({
  template: z.enum(["modern", "classic", "minimal", "corporate", "creative"]),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  fontFamily: z.enum(["inter", "roboto", "opensans", "lato", "poppins"]).default("inter"),
  layout: z.enum(["centered", "fullwidth", "boxed"]).default("centered"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWebsite = z.infer<typeof insertWebsiteSchema>;
export type Website = typeof websites.$inferSelect;
export type WebsiteGenerationRequest = z.infer<typeof websiteGenerationSchema>;
export type StylePreview = z.infer<typeof stylePreviewSchema>;
