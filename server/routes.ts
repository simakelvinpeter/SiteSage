import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { websiteGenerationSchema } from "@shared/schema";
import { generateWebsite } from "./services/openai";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate website endpoint
  app.post("/api/websites/generate", async (req, res) => {
    try {
      const validatedData = websiteGenerationSchema.parse(req.body);
      
      const generatedContent = await generateWebsite(validatedData);
      
      const website = await storage.createWebsite({
        name: validatedData.name,
        description: validatedData.description,
        generatedHtml: generatedContent.html,
        generatedCss: generatedContent.css,
        navigationItems: generatedContent.navigationItems,
        footerContent: generatedContent.footerContent,
        includeNavigation: validatedData.includeNavigation,
        includeFooter: validatedData.includeFooter,
        includeContactForm: validatedData.includeContactForm,
        isResponsive: validatedData.isResponsive,
        primaryColor: validatedData.primaryColor,
        secondaryColor: validatedData.secondaryColor,
        imageUrls: validatedData.imageUrls,
      });

      res.json(website);
    } catch (error) {
      console.error("Error generating website:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: error instanceof Error ? error.message : "Failed to generate website" 
        });
      }
    }
  });

  // Get website by ID
  app.get("/api/websites/:id", async (req, res) => {
    try {
      const website = await storage.getWebsite(req.params.id);
      if (!website) {
        return res.status(404).json({ message: "Website not found" });
      }
      res.json(website);
    } catch (error) {
      console.error("Error fetching website:", error);
      res.status(500).json({ message: "Failed to fetch website" });
    }
  });

  // Get recent websites
  app.get("/api/websites", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const websites = await storage.getUserWebsites(limit);
      res.json(websites);
    } catch (error) {
      console.error("Error fetching websites:", error);
      res.status(500).json({ message: "Failed to fetch websites" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
