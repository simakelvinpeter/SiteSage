import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { websiteGenerationSchema, type WebsiteGenerationRequest, type Website } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import LoadingDots from "@/components/ui/loading-dots";

interface WebsiteGeneratorProps {
  onWebsiteGenerated: (website: Website) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

export default function WebsiteGenerator({ onWebsiteGenerated, isGenerating, setIsGenerating }: WebsiteGeneratorProps) {
  const [charCount, setCharCount] = useState(0);
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
    },
  });

  const generateWebsiteMutation = useMutation({
    mutationFn: async (data: WebsiteGenerationRequest) => {
      const response = await apiRequest("POST", "/api/websites/generate", data);
      return response.json();
    },
    onSuccess: (website: Website) => {
      setIsGenerating(false);
      onWebsiteGenerated(website);
      toast({
        title: "Website Generated Successfully!",
        description: "Your website is ready for preview.",
      });
    },
    onError: (error: Error) => {
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate website. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: WebsiteGenerationRequest) => {
    if (data.description.length < 50) {
      toast({
        title: "Description Too Short",
        description: "Please provide at least 50 characters for better results.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    generateWebsiteMutation.mutate(data);
  };

  const handleDescriptionChange = (value: string) => {
    setCharCount(value.length);
    if (value.length > 500) {
      return value.substring(0, 500);
    }
    return value;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
          <i className="fas fa-wand-magic-sparkles text-white"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Website Generator</h2>
          <p className="text-slate-600">Powered by Advanced AI</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Website Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Mountain Adventure Tours, Tech Startup, Coffee Shop..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                    {...field}
                  />
                </FormControl>
                <p className="text-xs text-slate-500">This will be used as your website's main title</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Website Description <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="Describe your website's purpose, target audience, key features, and desired style. Be as detailed as possible for better results..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white resize-none"
                    {...field}
                    onChange={(e) => {
                      const value = handleDescriptionChange(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500">Minimum 50 characters for optimal results</p>
                  <span className="text-xs text-slate-400">{charCount}/500</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-700 mb-2">AI Generation Options</h3>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="includeNavigation"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="rounded text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-slate-600 cursor-pointer">
                      Generate navigation menu
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="includeFooter"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="rounded text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-slate-600 cursor-pointer">
                      Create footer with contact info
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isResponsive"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="rounded text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-slate-600 cursor-pointer">
                      Include responsive design
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="includeContactForm"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="rounded text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-slate-600 cursor-pointer">
                      Add contact form
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-primary/25"
          >
            {isGenerating ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Generating...
              </>
            ) : (
              <>
                <i className="fas fa-magic mr-2"></i>
                Generate Website
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Loading State */}
      {isGenerating && (
        <div className="mt-6 bg-slate-50 rounded-xl p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mb-4">
              <i className="fas fa-cog fa-spin text-white text-xl"></i>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">AI is working its magic...</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center justify-center space-x-2">
                <LoadingDots />
                <span>Analyzing your description</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <LoadingDots delay={200} />
                <span>Generating content structure</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <LoadingDots delay={400} />
                <span>Creating navigation & footer</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
