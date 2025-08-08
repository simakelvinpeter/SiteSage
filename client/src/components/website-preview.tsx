import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type Website } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface WebsitePreviewProps {
  website: Website | null;
  isGenerating: boolean;
}

export default function WebsitePreview({ website, isGenerating }: WebsitePreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const { toast } = useToast();

  const handleDownload = () => {
    if (!website) return;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${website.name}</title>
    <style>
${website.generatedCss}
    </style>
</head>
<body>
${website.generatedHtml}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${website.name.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Your website has been downloaded as an HTML file.",
    });
  };

  const handleViewCode = () => {
    if (!website) return;

    const codeWindow = window.open('', '_blank');
    if (codeWindow) {
      codeWindow.document.write(`
        <html>
          <head>
            <title>Generated Code - ${website.name}</title>
            <style>
              body { font-family: monospace; margin: 20px; background: #f5f5f5; }
              .section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; }
              h2 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
              pre { background: #f8f8f8; padding: 15px; border-radius: 4px; overflow-x: auto; }
            </style>
          </head>
          <body>
            <h1>Generated Code for: ${website.name}</h1>
            <div class="section">
              <h2>HTML</h2>
              <pre>${website.generatedHtml.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
            </div>
            <div class="section">
              <h2>CSS</h2>
              <pre>${website.generatedCss}</pre>
            </div>
          </body>
        </html>
      `);
    }
  };

  const getPreviewStyle = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '600px' };
      case 'tablet':
        return { width: '768px', height: '600px' };
      default:
        return { width: '100%', height: '600px' };
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <i className="fas fa-eye text-white"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Live Preview</h2>
            <p className="text-slate-600">See your website come to life</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('mobile')}
            className="p-2"
          >
            <i className="fas fa-mobile-alt"></i>
          </Button>
          <Button
            variant={viewMode === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('tablet')}
            className="p-2"
          >
            <i className="fas fa-tablet-alt"></i>
          </Button>
          <Button
            variant={viewMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('desktop')}
            className="p-2"
          >
            <i className="fas fa-desktop"></i>
          </Button>
        </div>
      </div>

      {/* Preview Window */}
      <div className="border-2 border-slate-200 rounded-xl overflow-hidden bg-white" style={{ height: '600px' }}>
        {!website && !isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
              <i className="fas fa-globe text-4xl text-slate-400"></i>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Your Website Preview</h3>
            <p className="text-slate-500 mb-6 max-w-sm">
              Fill out the form and click "Generate Website" to see your AI-created website appear here
            </p>
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <i className="fas fa-check-circle text-emerald-500"></i>
                <span>Responsive Design</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-check-circle text-emerald-500"></i>
                <span>Modern Styling</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-check-circle text-emerald-500"></i>
                <span>SEO Optimized</span>
              </div>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mb-4">
                <i className="fas fa-spinner fa-spin text-white text-xl"></i>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Generating your website...</h3>
              <p className="text-slate-600">This may take a few moments</p>
            </div>
          </div>
        )}

        {website && !isGenerating && (
          <div className="h-full overflow-auto mx-auto" style={getPreviewStyle()}>
            <iframe
              src={`/preview/${website.id}`}
              className="w-full h-full border-0"
              title="Website Preview"
              sandbox="allow-same-origin allow-scripts"
              onError={() => console.log('Preview iframe error')}
              onLoad={() => console.log('Preview iframe loaded')}
            />
          </div>
        )}
      </div>

      {/* Preview Actions */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <i className="fas fa-info-circle"></i>
          <span>Preview updates in real-time</span>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleViewCode}
            disabled={!website}
            className="flex items-center space-x-2"
          >
            <i className="fas fa-code"></i>
            <span className="hidden sm:inline">View Code</span>
          </Button>
          <Button
            onClick={handleDownload}
            disabled={!website}
            className="flex items-center space-x-2 bg-primary text-white hover:bg-indigo-600"
          >
            <i className="fas fa-download"></i>
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
