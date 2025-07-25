import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface WebsiteGenerationOptions {
  name: string;
  description: string;
  includeNavigation: boolean;
  includeFooter: boolean;
  includeContactForm: boolean;
  isResponsive: boolean;
}

export interface GeneratedWebsite {
  html: string;
  css: string;
  navigationItems: string[];
  footerContent: string;
}

export async function generateWebsite(options: WebsiteGenerationOptions): Promise<GeneratedWebsite> {
  const prompt = `
You are an expert web developer and designer. Generate a complete, professional website based on the following requirements:

Website Name: ${options.name}
Description: ${options.description}
Include Navigation: ${options.includeNavigation}
Include Footer: ${options.includeFooter}
Include Contact Form: ${options.includeContactForm}
Responsive Design: ${options.isResponsive}

Generate a complete website with:
1. Semantic HTML structure
2. Modern CSS styling with responsive design
3. Navigation menu with relevant sections
4. Footer with contact information and links
5. Hero section and content sections
6. Professional color scheme and typography
7. ${options.includeContactForm ? 'A contact form' : 'No contact form needed'}

Return the response as JSON with this exact structure:
{
  "html": "complete HTML document",
  "css": "complete CSS styles",
  "navigationItems": ["array", "of", "navigation", "menu", "items"],
  "footerContent": "footer content description"
}

Make the design modern, professional, and visually appealing. Use contemporary web design patterns, proper spacing, and good typography. Ensure the content is relevant to the website description provided.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert web developer and designer who creates beautiful, professional websites. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    if (!result.html || !result.css || !result.navigationItems || !result.footerContent) {
      throw new Error("Invalid response format from OpenAI");
    }

    return {
      html: result.html,
      css: result.css,
      navigationItems: Array.isArray(result.navigationItems) ? result.navigationItems : [],
      footerContent: result.footerContent,
    };
  } catch (error) {
    console.error("Error generating website:", error);
    throw new Error("Failed to generate website: " + (error as Error).message);
  }
}
