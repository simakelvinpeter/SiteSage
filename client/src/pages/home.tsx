import { useState } from "react";
import WebsiteGenerator from "@/components/website-generator";
import WebsitePreview from "@/components/website-preview";
import { Website } from "@shared/schema";

export default function Home() {
  const [generatedWebsite, setGeneratedWebsite] = useState<Website | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <i className="fas fa-magic text-white text-sm"></i>
              </div>
              <span className="text-xl font-bold text-slate-800">WebGenius AI</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Home</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Features</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Pricing</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Help</a>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-slate-600 hover:text-slate-900 font-medium transition-colors hidden sm:inline-block">
                Sign In
              </button>
              <button className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Get Started
              </button>
              <button className="md:hidden text-slate-600 hover:text-slate-900">
                <i className="fas fa-bars"></i>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Generate Beautiful Websites with
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> AI Magic</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Simply describe your vision, and our AI will create a complete, responsive website with navigation, content, and styling in seconds.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <WebsiteGenerator 
            onWebsiteGenerated={setGeneratedWebsite}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
          <WebsitePreview 
            website={generatedWebsite}
            isGenerating={isGenerating}
          />
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Powered by Advanced AI Technology</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our intelligent system understands your vision and creates professional websites with modern design patterns
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <i className="fas fa-brain text-white text-xl"></i>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Smart Content Generation</h3>
              <p className="text-sm text-slate-600">AI creates relevant, engaging content based on your description</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <i className="fas fa-mobile-alt text-white text-xl"></i>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Responsive Design</h3>
              <p className="text-sm text-slate-600">Automatically optimized for all devices and screen sizes</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <i className="fas fa-palette text-white text-xl"></i>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Modern Styling</h3>
              <p className="text-sm text-slate-600">Contemporary design with professional color schemes and typography</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <i className="fas fa-code text-white text-xl"></i>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Clean Code</h3>
              <p className="text-sm text-slate-600">Semantic HTML with optimized CSS for fast loading and SEO</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <i className="fas fa-magic text-white text-sm"></i>
                </div>
                <span className="text-xl font-bold text-white">WebGenius AI</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                Transform your ideas into beautiful, functional websites with the power of artificial intelligence. 
                No coding required, just your creativity.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <i className="fab fa-github"></i>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <i className="fab fa-discord"></i>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Access</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400">
              &copy; 2024 WebGenius AI. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
