import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { websiteGenerationSchema } from "@shared/schema";
import { generateWebsite } from "./services/openai";
import { z } from "zod";
import { visitorSession } from "./session";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(["/api", "/preview"], visitorSession());
  const attempts = new Map<string, { count: number; reset: number }>();
  app.post("/api/websites/generate", async (req, res) => {
    try {
      const origin = req.get("origin");
      if (origin && new URL(origin).host !== req.get("host")) {
        return res.status(403).json({ message: "Use this application's own form" });
      }
      const key = req.ip || "local";
      const time = Date.now();
      for (const [ip, attempt] of attempts) {
        if (attempt.reset < time) attempts.delete(ip);
      }
      const attempt = attempts.get(key) || { count: 0, reset: time + 3600000 };
      if (attempt.count >= 10) {
        return res.status(429).json({ message: "Generation limit reached. Try again in an hour." });
      }
      const validatedData = websiteGenerationSchema.parse(req.body);
      attempt.count++;
      attempts.set(key, attempt);
      
      const generatedContent = await generateWebsite(validatedData);
      
      const website = await storage.createWebsite({
        generationMode: generatedContent.mode,
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
      }, res.locals.owner);

      res.json(website);
    } catch (error) {
      if (!(error instanceof z.ZodError)) console.error("Website generation failed");
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Validation error", 
          errors: error.issues 
        });
      } else {
        res.status(500).json({ 
          message: "Failed to generate website. Please try again."
        });
      }
    }
  });

  app.get("/api/websites/:id", async (req, res) => {
    try {
      const website = await storage.getWebsite(req.params.id, res.locals.owner);
      if (!website) {
        return res.status(404).json({ message: "Website not found" });
      }
      res.json(website);
    } catch (error) {
      console.error("Error fetching website:", error);
      res.status(500).json({ message: "Failed to fetch website" });
    }
  });

  app.get("/api/websites", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const websites = await storage.getUserWebsites(limit, res.locals.owner);
      res.json(websites);
    } catch (error) {
      console.error("Error fetching websites:", error);
      res.status(500).json({ message: "Failed to fetch websites" });
    }
  });

  app.get("/preview/:id", async (req, res) => {
    try {
      const website = await storage.getWebsite(req.params.id, res.locals.owner);
      if (!website) {
        return res.status(404).send(`
          <html><body style="font-family: Arial; padding: 40px; text-align: center;">
            <h2>Website Not Found</h2>
            <p>The requested website preview could not be found.</p>
          </body></html>
        `);
      }
      
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated website preview</title>
    <style>
      body { margin: 0; padding: 0; }
      ${website.generatedCss || ''}
    </style>
</head>
<body>
    ${website.generatedHtml || '<div style="padding: 20px; text-align: center; color: #666;">No content available</div>'}
</body>
</html>`;
      
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Security-Policy', "sandbox; default-src 'none'; style-src 'unsafe-inline' https:; img-src https: data:; font-src https: data:; base-uri 'none'; form-action 'none'");
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.send(htmlContent);
    } catch (error) {
      console.error("Error serving website preview:", error);
      res.status(500).send(`
        <html><body style="font-family: Arial; padding: 40px; text-align: center;">
          <h2>Preview Error</h2>
          <p>Unable to load the website preview.</p>
        </body></html>
      `);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
