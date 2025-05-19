import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

const aboutSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  description: z.string().optional(),
  imageId: z.number().optional(),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

export default function AboutSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch current about content
  const { data: aboutContent, isLoading: isLoadingAbout } = useQuery({
    queryKey: ['/api/content/about'],
    retry: false,
  });

  // Fetch images for the about section
  const { data: aboutImages, isLoading: isLoadingImages } = useQuery({
    queryKey: ['/api/assets/about'],
    retry: false,
  });

  const form = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      content: "",
      description: "",
    },
  });

  useEffect(() => {
    // When about content is loaded, update form
    if (aboutContent) {
      form.reset({
        title: aboutContent.title || "About Our Company",
        subtitle: aboutContent.subtitle || "",
        content: aboutContent.content || "",
        description: aboutContent.description || "",
        imageId: aboutContent.imageId || undefined,
      });

      if (aboutContent.imageId && aboutImages) {
        const selectedImg = aboutImages.find((img: any) => img.id === aboutContent.imageId);
        if (selectedImg) {
          loadImageData(selectedImg.id);
        }
      }
    }
  }, [aboutContent, aboutImages, form]);

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
          section: 'about',
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

  const onSubmit = async (data: AboutFormValues) => {
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
      
      const response = await fetch('/api/content/about', {
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
        throw new Error('Failed to update about content');
      }
      
      // Refetch about content
      await queryClient.invalidateQueries({ queryKey: ['/api/content/about'] });
      
      toast({
        title: 'About Section Updated',
        description: 'Your about section has been updated successfully.',
      });
      
      // Reset image file state
      setImageFile(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update about section. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingAbout) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>About Section</CardTitle>
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
            <CardTitle>About Section</CardTitle>
            <CardDescription>
              Edit the content of your about section
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
                    <Input placeholder="About Our Company" {...field} />
                  </FormControl>
                  <FormDescription>
                    The main heading for your about section
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
                    <Input placeholder="Learn more about us" {...field} />
                  </FormControl>
                  <FormDescription>
                    A brief subtitle that appears below the main title
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
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="A brief description about your company" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A short paragraph that appears at the beginning of the about section
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed information about your company, history, values, etc." 
                      rows={8}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    The main content of your about section. You can use multiple paragraphs.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-3">
              <Label>About Image</Label>
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
                      alt="About preview" 
                      className="rounded-md max-h-[300px] object-contain"
                    />
                  </div>
                )}
                
                {!selectedImage && (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-12 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No image selected. Upload an image to display in the about section.
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