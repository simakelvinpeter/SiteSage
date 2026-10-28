import { z } from "zod";

export const websiteGenerationSchema = z.object({
  name: z.string().trim().min(1, "Website name is required").max(100),
  description: z.string().trim().min(50, "Description must be at least 50 characters").max(5000),
  includeNavigation: z.boolean().default(true),
  includeFooter: z.boolean().default(true),
  includeContactForm: z.boolean().default(false),
  isResponsive: z.boolean().default(true),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color").default("#667eea"),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color").default("#764ba2"),
  imageUrls: z.array(z.string().url("Must be a valid URL").max(2000).refine((url) => url.startsWith("https://"), "Use HTTPS image URLs")).max(10).default([]),
  styleTemplate: z.enum(["modern", "classic", "minimal", "corporate", "creative"]).default("modern"),
});

export const stylePreviewSchema = z.object({
  template: z.enum(["modern", "classic", "minimal", "corporate", "creative"]),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  fontFamily: z.enum(["inter", "roboto", "opensans", "lato", "poppins"]).default("inter"),
  layout: z.enum(["centered", "fullwidth", "boxed"]).default("centered"),
});

export interface Website {
  id: string;
  name: string;
  description: string;
  generatedHtml: string;
  generatedCss: string;
  navigationItems: string[] | null;
  footerContent: string | null;
  includeNavigation: boolean | null;
  includeFooter: boolean | null;
  includeContactForm: boolean | null;
  isResponsive: boolean | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  imageUrls: string[] | null;
  createdAt: Date | null;
  generationMode?: "ai" | "template";
}

export type WebsiteGenerationRequest = z.infer<typeof websiteGenerationSchema>;
export type StylePreview = z.infer<typeof stylePreviewSchema>;
