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

function generateDemoWebsite(options: WebsiteGenerationOptions): GeneratedWebsite {
  const navItems = options.includeNavigation ? ['Home', 'About', 'Services', 'Contact'] : [];
  
  const html = `
    <div class="website-container">
      ${options.includeNavigation ? `
        <nav class="main-nav">
          <div class="nav-brand">${options.name}</div>
          <ul class="nav-menu">
            ${navItems.map(item => `<li><a href="#${item.toLowerCase()}">${item}</a></li>`).join('')}
          </ul>
        </nav>
      ` : ''}
      
      <main class="main-content">
        <section class="hero">
          <h1>${options.name}</h1>
          <p class="hero-description">${options.description}</p>
          <button class="cta-button">Get Started</button>
        </section>
        
        <section class="features">
          <div class="container">
            <h2>Our Features</h2>
            <div class="feature-grid">
              <div class="feature-card">
                <h3>Professional Design</h3>
                <p>Modern and clean design that reflects your brand perfectly.</p>
              </div>
              <div class="feature-card">
                <h3>Responsive Layout</h3>
                <p>Looks great on all devices - desktop, tablet, and mobile.</p>
              </div>
              <div class="feature-card">
                <h3>Fast Performance</h3>
                <p>Optimized for speed and excellent user experience.</p>
              </div>
            </div>
          </div>
        </section>

        ${options.includeContactForm ? `
          <section class="contact">
            <div class="container">
              <h2>Contact Us</h2>
              <form class="contact-form">
                <input type="text" placeholder="Your Name" required>
                <input type="email" placeholder="Your Email" required>
                <textarea placeholder="Your Message" required></textarea>
                <button type="submit">Send Message</button>
              </form>
            </div>
          </section>
        ` : ''}
      </main>
      
      ${options.includeFooter ? `
        <footer class="main-footer">
          <div class="container">
            <div class="footer-content">
              <div class="footer-section">
                <h3>${options.name}</h3>
                <p>Thank you for visiting our website. We look forward to working with you.</p>
              </div>
              <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                  ${navItems.map(item => `<li><a href="#${item.toLowerCase()}">${item}</a></li>`).join('')}
                </ul>
              </div>
              <div class="footer-section">
                <h4>Contact Info</h4>
                <p>Email: info@${options.name.toLowerCase().replace(/\s+/g, '')}.com</p>
                <p>Phone: (555) 123-4567</p>
              </div>
            </div>
            <div class="footer-bottom">
              <p>&copy; 2024 ${options.name}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      ` : ''}
    </div>
  `;

  const css = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
    }

    .website-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .main-nav {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
    }

    .nav-brand {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .nav-menu {
      display: flex;
      list-style: none;
      gap: 2rem;
    }

    .nav-menu a {
      color: white;
      text-decoration: none;
      transition: opacity 0.3s;
    }

    .nav-menu a:hover {
      opacity: 0.8;
    }

    .main-content {
      flex: 1;
    }

    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      padding: 5rem 2rem;
    }

    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .hero-description {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .cta-button {
      background: #ff6b6b;
      color: white;
      border: none;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .cta-button:hover {
      background: #ee5a5a;
    }

    .features {
      padding: 5rem 2rem;
      background: #f8f9fa;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .features h2 {
      text-align: center;
      margin-bottom: 3rem;
      font-size: 2.5rem;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      text-align: center;
    }

    .feature-card h3 {
      margin-bottom: 1rem;
      color: #667eea;
    }

    .contact {
      padding: 5rem 2rem;
    }

    .contact h2 {
      text-align: center;
      margin-bottom: 3rem;
      font-size: 2.5rem;
    }

    .contact-form {
      max-width: 600px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .contact-form input,
    .contact-form textarea {
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 1rem;
    }

    .contact-form textarea {
      min-height: 120px;
      resize: vertical;
    }

    .contact-form button {
      background: #667eea;
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s;
    }

    .contact-form button:hover {
      background: #5a6fd8;
    }

    .main-footer {
      background: #2c3e50;
      color: white;
      padding: 3rem 2rem 1rem;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .footer-section h3,
    .footer-section h4 {
      margin-bottom: 1rem;
    }

    .footer-section ul {
      list-style: none;
    }

    .footer-section ul li {
      margin-bottom: 0.5rem;
    }

    .footer-section a {
      color: #bdc3c7;
      text-decoration: none;
      transition: color 0.3s;
    }

    .footer-section a:hover {
      color: white;
    }

    .footer-bottom {
      border-top: 1px solid #34495e;
      padding-top: 1rem;
      text-align: center;
      color: #bdc3c7;
    }

    ${options.isResponsive ? `
    @media (max-width: 768px) {
      .nav-menu {
        display: none;
      }
      
      .hero h1 {
        font-size: 2rem;
      }
      
      .hero-description {
        font-size: 1rem;
      }
      
      .feature-grid {
        grid-template-columns: 1fr;
      }
    }
    ` : ''}
  `;

  return {
    html,
    css,
    navigationItems: navItems,
    footerContent: `Professional footer with contact information and links for ${options.name}`
  };
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
    console.error("Error generating website with AI, falling back to demo mode:", error);
    
    // Check if it's a quota/billing error
    if (error instanceof Error && (
      error.message.includes('quota') || 
      error.message.includes('insufficient_quota') ||
      error.message.includes('429')
    )) {
      console.log("Using demo mode due to API quota limitations");
      return generateDemoWebsite(options);
    }
    
    throw new Error("Failed to generate website: " + (error as Error).message);
  }
}
