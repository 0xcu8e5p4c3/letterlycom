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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Pencil, Trash2, Plus, Save } from "lucide-react";

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().optional(),
  order: z.number().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function ServicesSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch current services
  const { data: services = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ['/api/content/services'],
    retry: false,
  });

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      icon: "",
      order: 0,
    },
  });

  const resetForm = () => {
    form.reset({
      title: "",
      description: "",
      icon: "",
      order: services.length > 0 ? Math.max(...services.map((s: any) => s.order)) + 1 : 1,
    });
    setIsEditing(false);
    setEditingId(null);
  };

  useEffect(() => {
    // Set default order when services load
    if (services && services.length > 0 && !isEditing) {
      form.setValue("order", Math.max(...services.map((s: any) => s.order)) + 1);
    }
  }, [services, form, isEditing]);

  const handleEdit = (service: any) => {
    setIsEditing(true);
    setEditingId(service.id);
    form.reset({
      title: service.title,
      description: service.description,
      icon: service.icon || "",
      order: service.order,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/content/services/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete service');
      }
      
      // Refetch services
      await queryClient.invalidateQueries({ queryKey: ['/api/content/services'] });
      
      toast({
        title: 'Service Deleted',
        description: 'Service has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete service. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ServiceFormValues) => {
    setIsLoading(true);
    try {
      let response;
      
      if (isEditing && editingId) {
        // Update existing service
        response = await fetch(`/api/content/services/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      } else {
        // Create new service
        response = await fetch('/api/content/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }
      
      if (!response.ok) {
        throw new Error('Failed to save service');
      }
      
      // Refetch services
      await queryClient.invalidateQueries({ queryKey: ['/api/content/services'] });
      
      toast({
        title: isEditing ? 'Service Updated' : 'Service Created',
        description: `Service has been ${isEditing ? 'updated' : 'created'} successfully.`,
      });
      
      // Reset form
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} service. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingServices) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
          <CardDescription>Loading services...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Service' : 'Add New Service'}</CardTitle>
          <CardDescription>
            {isEditing 
              ? 'Update the details of an existing service' 
              : 'Add a new service to display on your website'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Web Development" {...field} />
                    </FormControl>
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
                        placeholder="Describe this service in detail" 
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., code, server, globe" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter an icon name from Lucide icons (e.g., "code" for code icon)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        value={field.value || 0}
                      />
                    </FormControl>
                    <FormDescription>
                      Lower numbers appear first
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2 pt-4">
                {isEditing && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={resetForm}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                )}
                <Button 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : isEditing 
                    ? 'Update Service' 
                    : 'Add Service'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Services</CardTitle>
          <CardDescription>
            Edit or delete existing services
          </CardDescription>
        </CardHeader>
        <CardContent>
          {services.length > 0 ? (
            <Table>
              <TableCaption>List of all services</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service: any) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.order}</TableCell>
                    <TableCell className="font-medium">{service.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{service.description}</TableCell>
                    <TableCell>{service.icon || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(service)}
                          disabled={isLoading}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(service.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-10">
              <p className="text-muted-foreground">
                No services added yet. Use the form above to add services.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}