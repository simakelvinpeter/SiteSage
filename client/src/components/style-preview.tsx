import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { type StylePreview } from "@shared/schema";

interface StylePreviewProps {
  currentStyle: StylePreview;
  onStyleChange: (style: StylePreview) => void;
  websiteName: string;
  websiteDescription: string;
}

const styleTemplates = {
  modern: {
    name: "Modern",
    description: "Clean lines, gradients, and contemporary design",
    primaryColor: "#667eea",
    secondaryColor: "#764ba2",
    fontFamily: "inter",
    layout: "centered"
  },
  classic: {
    name: "Classic",
    description: "Traditional, professional with serif fonts",
    primaryColor: "#2c3e50",
    secondaryColor: "#34495e", 
    fontFamily: "roboto",
    layout: "boxed"
  },
  minimal: {
    name: "Minimal",
    description: "Simple, spacious with lots of white space",
    primaryColor: "#1a202c",
    secondaryColor: "#4a5568",
    fontFamily: "inter",
    layout: "centered"
  },
  corporate: {
    name: "Corporate",
    description: "Business-focused, professional blue theme",
    primaryColor: "#3182ce",
    secondaryColor: "#2b6cb0",
    fontFamily: "opensans",
    layout: "fullwidth"
  },
  creative: {
    name: "Creative",
    description: "Bold colors, artistic and expressive",
    primaryColor: "#ed64a6",
    secondaryColor: "#9f7aea",
    fontFamily: "poppins",
    layout: "centered"
  }
};

const fontFamilies = {
  inter: "Inter, sans-serif",
  roboto: "Roboto, sans-serif", 
  opensans: "Open Sans, sans-serif",
  lato: "Lato, sans-serif",
  poppins: "Poppins, sans-serif"
};

export default function StylePreview({ currentStyle, onStyleChange, websiteName, websiteDescription }: StylePreviewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof styleTemplates>(currentStyle.template);

  const handleTemplateSelect = (template: keyof typeof styleTemplates) => {
    setSelectedTemplate(template);
    const templateData = styleTemplates[template];
    onStyleChange({
      template: template as any,
      primaryColor: templateData.primaryColor,
      secondaryColor: templateData.secondaryColor,
      fontFamily: templateData.fontFamily as any,
      layout: templateData.layout as any
    });
  };

  const handleStyleChange = (changes: Partial<StylePreview>) => {
    onStyleChange({
      ...currentStyle,
      ...changes
    });
  };

  const getPreviewStyle = () => ({
    fontFamily: fontFamilies[currentStyle.fontFamily],
    background: `linear-gradient(135deg, ${currentStyle.primaryColor}20, ${currentStyle.secondaryColor}20)`,
    color: "#2d3748"
  });

  const getButtonStyle = () => ({
    backgroundColor: currentStyle.primaryColor,
    borderColor: currentStyle.primaryColor,
    color: "white"
  });

  const getSecondaryStyle = () => ({
    color: currentStyle.secondaryColor,
    borderColor: currentStyle.secondaryColor + "50"
  });

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-palette text-purple-500"></i>
            <span>Style Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(styleTemplates).map(([key, template]) => (
              <div 
                key={key}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedTemplate === key 
                    ? 'border-primary bg-primary/5' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => handleTemplateSelect(key as keyof typeof styleTemplates)}
                data-testid={`template-${key}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{template.name}</h3>
                  {selectedTemplate === key && <Badge>Selected</Badge>}
                </div>
                <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: template.primaryColor }}
                  ></div>
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: template.secondaryColor }}
                  ></div>
                  <span className="text-xs text-slate-500 ml-2" style={{ fontFamily: fontFamilies[template.fontFamily as keyof typeof fontFamilies] }}>
                    {fontFamilies[template.fontFamily as keyof typeof fontFamilies].split(',')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Style Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-sliders-h text-blue-500"></i>
            <span>Customize Style</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Font Family</label>
              <Select 
                value={currentStyle.fontFamily} 
                onValueChange={(value) => handleStyleChange({ fontFamily: value as any })}
              >
                <SelectTrigger data-testid="select-font-family">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(fontFamilies).map(([key, family]) => (
                    <SelectItem key={key} value={key} style={{ fontFamily: family }}>
                      {family.split(',')[0]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Layout Style</label>
              <Select 
                value={currentStyle.layout} 
                onValueChange={(value) => handleStyleChange({ layout: value as any })}
              >
                <SelectTrigger data-testid="select-layout">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="centered">Centered</SelectItem>
                  <SelectItem value="fullwidth">Full Width</SelectItem>
                  <SelectItem value="boxed">Boxed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={currentStyle.primaryColor}
                  onChange={(e) => handleStyleChange({ primaryColor: e.target.value })}
                  className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                  data-testid="input-primary-color"
                />
                <input
                  type="text"
                  value={currentStyle.primaryColor}
                  onChange={(e) => handleStyleChange({ primaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="#667eea"
                  data-testid="input-primary-color-text"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-eye text-green-500"></i>
            <span>Live Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="border-2 border-slate-200 rounded-lg p-8 min-h-64"
            style={getPreviewStyle()}
            data-testid="style-preview-container"
          >
            {/* Mini website preview */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
              {/* Navigation */}
              <div className="px-6 py-4 border-b" style={{ borderColor: currentStyle.primaryColor + "20" }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold" style={{ color: currentStyle.primaryColor, fontFamily: fontFamilies[currentStyle.fontFamily] }}>
                    {websiteName || "Your Website"}
                  </h3>
                  <div className="flex space-x-4 text-sm">
                    <span style={{ color: currentStyle.secondaryColor }}>Home</span>
                    <span className="text-slate-500">About</span>
                    <span className="text-slate-500">Contact</span>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-3" style={{ color: currentStyle.primaryColor, fontFamily: fontFamilies[currentStyle.fontFamily] }}>
                  Welcome
                </h1>
                <p className="text-slate-600 mb-4 text-sm" style={{ fontFamily: fontFamilies[currentStyle.fontFamily] }}>
                  {websiteDescription || "Your amazing website description will appear here with beautiful styling."}
                </p>
                <div className="flex space-x-3">
                  <button 
                    className="px-4 py-2 rounded text-sm font-medium"
                    style={getButtonStyle()}
                  >
                    Get Started
                  </button>
                  <button 
                    className="px-4 py-2 rounded text-sm font-medium border"
                    style={getSecondaryStyle()}
                  >
                    Learn More
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t text-center" style={{ borderColor: currentStyle.primaryColor + "20" }}>
                <p className="text-xs text-slate-500" style={{ fontFamily: fontFamilies[currentStyle.fontFamily] }}>
                  © 2024 {websiteName || "Your Website"}. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}