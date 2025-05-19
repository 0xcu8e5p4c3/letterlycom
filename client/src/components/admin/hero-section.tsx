import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const heroSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  imageId: z.number().optional(),
});

type HeroFormValues = z.infer<typeof heroSchema>;

export default function HeroSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch current hero content
  const { data: heroContent, isLoading: isLoadingHero } = useQuery({
    queryKey: ['/api/content/hero'],
    retry: false,
  });

  // Fetch images for the hero section
  const { data: heroImages, isLoading: isLoadingImages } = useQuery({
    queryKey: ['/api/assets/hero'],
    retry: false,
  });

  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      buttonText: "",
      buttonLink: "",
    },
  });

  useEffect(() => {
    // When hero content is loaded, update form
    if (heroContent) {
      form.reset({
        title: heroContent.title || "Welcome to Our Company",
        subtitle: heroContent.subtitle || "",
        description: heroContent.description || "",
        buttonText: heroContent.buttonText || "",
        buttonLink: heroContent.buttonLink || "",
        imageId: heroContent.imageId || undefined,
      });

      if (heroContent.imageId && heroImages) {
        const selectedImg = heroImages.find((img: any) => img.id === heroContent.imageId);
        if (selectedImg) {
          loadImageData(selectedImg.id);
        }
      }
    }
  }, [heroContent, heroImages, form]);

  const loadImageData = async (imageId: number) => {
    try {
      const response = await fetch(`/api/assets/file/${imageId}`);
      if (response.ok) {
        const imageData = await response.json();
        setSelectedImage(`data:${imageData.contentType};base64,${imageData.data}`);
      }
    } catch (error) {
      console.error("Error loading image:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<number | null> => {
    if (!imageFile) return null;
    
    setUploadingImage(true);
    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(imageFile);
      });
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: imageFile.name,
          section: 'hero',
          contentType: imageFile.type,
          data: base64,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const result = await response.json();
      return result.asset.id;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: HeroFormValues) => {
    setIsLoading(true);
    try {
      let imageId = data.imageId;
      
      // If there's a new image, upload it first
      if (imageFile) {
        const uploadedImageId = await uploadImage();
        if (uploadedImageId) {
          imageId = uploadedImageId;
        }
      }
      
      const response = await fetch('/api/content/hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          imageId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update hero content');
      }
      
      // Refetch hero content
      await queryClient.invalidateQueries({ queryKey: ['/api/content/hero'] });
      
      toast({
        title: 'Hero updated',
        description: 'Your hero section has been updated successfully.',
      });
      
      // Reset image file state
      setImageFile(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update hero section. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingHero) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Loading content...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>
              Edit the content of your website's hero section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a catchy headline" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the main headline displayed in the hero section
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Input placeholder="A brief subtitle" {...field} />
                  </FormControl>
                  <FormDescription>
                    A short subtitle that appears below the main title
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter a description of your business or service" 
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A longer description that provides more information
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="buttonText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Learn More" {...field} />
                    </FormControl>
                    <FormDescription>
                      Text displayed on the call-to-action button
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="buttonLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Link</FormLabel>
                    <FormControl>
                      <Input placeholder="#about" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL or anchor link when the button is clicked
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-3">
              <Label>Hero Image</Label>
              <div className="grid grid-cols-1 gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                
                {selectedImage && (
                  <div className="mt-2 relative">
                    <img 
                      src={selectedImage} 
                      alt="Hero preview" 
                      className="rounded-md max-h-[300px] object-contain"
                    />
                  </div>
                )}
                
                {!selectedImage && (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-12 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No image selected. Upload an image to display in the hero section.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => form.reset()}
              disabled={isLoading || uploadingImage}
            >
              Reset
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || uploadingImage}
            >
              {isLoading || uploadingImage ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}