import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { websiteGenerationSchema, type WebsiteGenerationRequest, type Website, type StylePreview } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import LoadingDots from "@/components/ui/loading-dots";
import StylePreviewComponent from "@/components/style-preview";

interface WebsiteGeneratorProps {
  onWebsiteGenerated: (website: Website) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

export default function WebsiteGenerator({ onWebsiteGenerated, isGenerating, setIsGenerating }: WebsiteGeneratorProps) {
  const [charCount, setCharCount] = useState(0);
  const [activeTab, setActiveTab] = useState("details");
  const [currentStyle, setCurrentStyle] = useState<StylePreview>({
    template: "modern",
    primaryColor: "#667eea",
    secondaryColor: "#764ba2",
    fontFamily: "inter",
    layout: "centered"
  });
  const { toast } = useToast();

  const form = useForm<WebsiteGenerationRequest>({
    resolver: zodResolver(websiteGenerationSchema),
    defaultValues: {
      name: "",
      description: "",
      includeNavigation: true,
      includeFooter: true,
      includeContactForm: false,
      isResponsive: true,
      primaryColor: "#667eea",
      secondaryColor: "#764ba2",
      imageUrls: [],
      styleTemplate: "modern",
    },
  });

  // Update form when style changes
  useEffect(() => {
    form.setValue("primaryColor", currentStyle.primaryColor);
    form.setValue("secondaryColor", currentStyle.secondaryColor);
    form.setValue("styleTemplate", currentStyle.template);
  }, [currentStyle, form]);

  const generateWebsiteMutation = useMutation({
    mutationFn: async (data: WebsiteGenerationRequest): Promise<Website> => {
      const response = await fetch("/api/websites/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to generate website");
      }
      return response.json();
    },
    onSuccess: (data: Website) => {
      onWebsiteGenerated(data);
      toast({
        title: "Website Generated!",
        description: "Your website has been created successfully.",
      });
    },
    onError: (error: any) => {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate website. Please try again.",
        variant: "destructive",
      });
    },
    onMutate: () => setIsGenerating(true),
    onSettled: () => setIsGenerating(false),
  });

  const onSubmit = (data: WebsiteGenerationRequest) => {
    generateWebsiteMutation.mutate(data);
  };

  const addImageUrl = () => {
    const currentUrls = form.getValues("imageUrls");
    form.setValue("imageUrls", [...currentUrls, ""]);
  };

  const removeImageUrl = (index: number) => {
    const currentUrls = form.getValues("imageUrls");
    form.setValue("imageUrls", currentUrls.filter((_, i) => i !== index));
  };

  const updateImageUrl = (index: number, value: string) => {
    const currentUrls = form.getValues("imageUrls");
    const updatedUrls = [...currentUrls];
    updatedUrls[index] = value;
    form.setValue("imageUrls", updatedUrls);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
          <i className="fas fa-wand-magic-sparkles text-white"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">AI Website Generator</h2>
          <p className="text-slate-600">Tell us about your website and we'll create it instantly</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details" data-testid="tab-details">Website Details</TabsTrigger>
          <TabsTrigger value="style" data-testid="tab-style">Style Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6 mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Website Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Website Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your website name"
                        className="border-slate-300 focus:border-primary focus:ring-primary"
                        data-testid="input-website-name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Website Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">
                      Website Description * <span className="text-sm text-slate-500">({charCount}/1000 characters)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your website in detail - what it's about, your target audience, key features, and the message you want to convey..."
                        className="border-slate-300 focus:border-primary focus:ring-primary min-h-32 resize-none"
                        maxLength={1000}
                        data-testid="input-website-description"
                        {...field}
                        onChange={(e) => {
                          setCharCount(e.target.value.length);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Colors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Primary Color</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={field.value}
                            onChange={field.onChange}
                            className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                            data-testid="input-primary-color-picker"
                          />
                          <Input
                            placeholder="#667eea"
                            className="border-slate-300 focus:border-primary focus:ring-primary"
                            data-testid="input-primary-color-text"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Secondary Color</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={field.value}
                            onChange={field.onChange}
                            className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                            data-testid="input-secondary-color-picker"
                          />
                          <Input
                            placeholder="#764ba2"
                            className="border-slate-300 focus:border-primary focus:ring-primary"
                            data-testid="input-secondary-color-text"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Image URLs */}
              <div className="space-y-3">
                <FormLabel className="text-slate-700 font-medium">Images (Optional)</FormLabel>
                {form.watch("imageUrls").map((url, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={url}
                      onChange={(e) => updateImageUrl(index, e.target.value)}
                      className="border-slate-300 focus:border-primary focus:ring-primary"
                      data-testid={`input-image-url-${index}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeImageUrl(index)}
                      className="shrink-0"
                      data-testid={`button-remove-image-${index}`}
                    >
                      <i className="fas fa-trash text-red-500"></i>
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addImageUrl}
                  className="w-full border-dashed border-2 border-slate-300 hover:border-primary hover:bg-primary/5"
                  data-testid="button-add-image"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add Image URL
                </Button>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <FormLabel className="text-slate-700 font-medium">Website Features</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="includeNavigation"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-include-navigation"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Include Navigation</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="includeFooter"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-include-footer"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Include Footer</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="includeContactForm"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-include-contact-form"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Include Contact Form</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isResponsive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-is-responsive"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Responsive Design</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setActiveTab("style")}
                  data-testid="button-preview-style"
                >
                  <i className="fas fa-eye mr-2"></i>
                  Preview Style
                </Button>
                
                <Button 
                  type="submit" 
                  disabled={isGenerating}
                  className="bg-primary text-white hover:bg-indigo-600 min-w-32"
                  data-testid="button-generate-website"
                >
                  {isGenerating ? (
                    <>
                      <LoadingDots />
                      <span className="ml-2">Generating...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic mr-2"></i>
                      Generate Website
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="style" className="mt-6">
          <StylePreviewComponent 
            currentStyle={currentStyle}
            onStyleChange={setCurrentStyle}
            websiteName={form.watch("name")}
            websiteDescription={form.watch("description")}
          />
          <div className="mt-6 flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab("details")}
              data-testid="button-back-to-details"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Details
            </Button>
            <Button 
              onClick={form.handleSubmit(onSubmit)} 
              disabled={isGenerating}
              className="bg-primary text-white hover:bg-indigo-600"
              data-testid="button-generate-from-style"
            >
              {isGenerating ? (
                <>
                  <LoadingDots />
                  <span className="ml-2">Generating...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-magic mr-2"></i>
                  Generate Website
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}