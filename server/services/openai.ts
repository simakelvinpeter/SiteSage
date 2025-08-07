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
  primaryColor: string;
  secondaryColor: string;
  imageUrls: string[];
}

export interface GeneratedWebsite {
  html: string;
  css: string;
  navigationItems: string[];
  footerContent: string;
}

function generateDemoWebsite(options: WebsiteGenerationOptions): GeneratedWebsite {
  const navItems = options.includeNavigation ? ['Home', 'About', 'Services', 'Contact'] : [];
  
  // Generate image gallery if images are provided
  const imageGallery = options.imageUrls.length > 0 ? `
    <section class="image-gallery">
      <div class="container">
        <h2>Gallery</h2>
        <div class="gallery-grid">
          ${options.imageUrls.map((url, index) => `
            <div class="gallery-item">
              <img src="${url}" alt="Gallery image ${index + 1}" loading="lazy" />
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  ` : '';

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
          ${options.imageUrls.length > 0 ? `
            <div class="hero-image">
              <img src="${options.imageUrls[0]}" alt="Hero image" />
            </div>
          ` : ''}
          <div class="hero-content">
            <h1>${options.name}</h1>
            <p class="hero-description">${options.description}</p>
            <button class="cta-button">Get Started</button>
          </div>
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

        ${imageGallery}

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
      background: linear-gradient(135deg, ${options.primaryColor} 0%, ${options.secondaryColor} 100%);
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
      background: linear-gradient(135deg, ${options.primaryColor} 0%, ${options.secondaryColor} 100%);
      color: white;
      text-align: center;
      padding: 5rem 2rem;
      position: relative;
      ${options.imageUrls.length > 0 ? 'min-height: 80vh; display: flex; align-items: center; justify-content: center;' : ''}
    }

    .hero-image {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }

    .hero-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.3;
    }

    .hero-content {
      position: relative;
      z-index: 2;
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
      color: ${options.primaryColor};
    }

    .image-gallery {
      padding: 5rem 2rem;
      background: #f8f9fa;
    }

    .image-gallery h2 {
      text-align: center;
      margin-bottom: 3rem;
      font-size: 2.5rem;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .gallery-item {
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .gallery-item img {
      width: 100%;
      height: 250px;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .gallery-item:hover img {
      transform: scale(1.05);
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
      background: ${options.primaryColor};
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s;
    }

    .contact-form button:hover {
      background: ${options.secondaryColor};
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
Primary Color: ${options.primaryColor}
Secondary Color: ${options.secondaryColor}
${options.imageUrls.length > 0 ? `Images to Include: ${options.imageUrls.join(', ')}` : 'No images provided'}

Generate a complete website with:
1. Semantic HTML structure
2. Modern CSS styling with responsive design using the specified color scheme
3. Navigation menu with relevant sections
4. Footer with contact information and links
5. Hero section and content sections
6. Use the provided primary color (${options.primaryColor}) and secondary color (${options.secondaryColor}) throughout the design
7. ${options.includeContactForm ? 'A contact form' : 'No contact form needed'}
${options.imageUrls.length > 0 ? `8. Include the provided images in an attractive layout - use the first image as a hero background if appropriate` : ''}

Color Usage Guidelines:
- Use ${options.primaryColor} for primary elements like buttons, navigation, headings
- Use ${options.secondaryColor} for accents, hover states, and secondary elements
- Create gradients between these colors where appropriate
- Ensure good contrast for readability

${options.imageUrls.length > 0 ? `
Image Integration:
- First image: Use as hero background or prominent feature
- Additional images: Create an image gallery or integrate throughout content
- All images should use the provided URLs: ${options.imageUrls.join(', ')}
- Add proper alt tags and responsive sizing
` : ''}

Return the response as JSON with this exact structure:
{
  "html": "complete HTML document",
  "css": "complete CSS styles with the specified color scheme",
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
