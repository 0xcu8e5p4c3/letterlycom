import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Trash, Pencil, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TeamMember } from "@shared/schema";

// Form schema
const teamMemberFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  image: z.string().url("Must be a valid URL"),
  linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  twitter: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  email: z.string().email("Must be a valid email address"),
});

type TeamMemberFormValues = z.infer<typeof teamMemberFormSchema>;

export default function TeamSection() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query team members
  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['/api/content/team'],
    staleTime: 1000 * 60, // 1 minute
  });

  // Create member mutation
  const createMemberMutation = useMutation({
    mutationFn: async (data: TeamMemberFormValues) => {
      // Convert social to the expected format
      const socialData = {
        linkedin: data.linkedin || undefined,
        twitter: data.twitter || undefined,
        github: data.github || undefined,
        email: data.email
      };
      
      const { linkedin, twitter, github, email, ...restData } = data;
      
      return apiRequest('/api/content/team', 'POST', {
        ...restData,
        social: socialData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content/team'] });
      toast({
        title: "Success",
        description: "Team member has been added",
      });
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add team member. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update member mutation
  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: TeamMemberFormValues }) => {
      // Convert social to the expected format
      const socialData = {
        linkedin: data.linkedin || undefined,
        twitter: data.twitter || undefined,
        github: data.github || undefined,
        email: data.email
      };
      
      const { linkedin, twitter, github, email, ...restData } = data;
      
      return apiRequest(`/api/content/team/${id}`, 'PATCH', {
        ...restData,
        social: socialData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content/team'] });
      toast({
        title: "Success",
        description: "Team member has been updated",
      });
      setEditingMember(null);
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update team member. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete member mutation
  const deleteMemberMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/content/team/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content/team'] });
      toast({
        title: "Success",
        description: "Team member has been deleted",
      });
      setDeletingId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete team member. Please try again.",
        variant: "destructive",
      });
      setDeletingId(null);
    }
  });

  // Setup form with react-hook-form
  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      name: "",
      role: "",
      bio: "",
      image: "",
      linkedin: "",
      twitter: "",
      github: "",
      email: "",
    },
  });

  const handleAddEdit = (member?: TeamMember) => {
    if (member) {
      // Edit mode - set form values from member
      form.reset({
        name: member.name,
        role: member.role,
        bio: member.bio,
        image: member.image,
        linkedin: member.social?.linkedin || "",
        twitter: member.social?.twitter || "",
        github: member.social?.github || "",
        email: member.social?.email || "",
      });
      setEditingMember(member);
    } else {
      // Add mode - reset form to defaults
      form.reset({
        name: "",
        role: "",
        bio: "",
        image: "",
        linkedin: "",
        twitter: "",
        github: "",
        email: "",
      });
      setEditingMember(null);
    }
    setDialogOpen(true);
  };

  const onSubmit = (data: TeamMemberFormValues) => {
    if (editingMember) {
      updateMemberMutation.mutate({ id: editingMember.id, data });
    } else {
      createMemberMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    deleteMemberMutation.mutate(id);
  };

  const isSubmitting = form.formState.isSubmitting || 
                      createMemberMutation.isPending || 
                      updateMemberMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Management</h2>
        <Button onClick={() => handleAddEdit()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : teamMembers.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent>
            <p className="py-12 text-muted-foreground">No team members found. Add your first team member with the button above.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member: TeamMember) => (
            <Card key={member.id} className="overflow-hidden">
              <div className="relative w-full pt-[100%] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover transition-all hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{member.bio}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAddEdit(member)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(member.id)}
                  disabled={deletingId === member.id}
                >
                  {deletingId === member.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingMember ? "Edit Team Member" : "Add New Team Member"}</DialogTitle>
            <DialogDescription>
              Fill in the form below to {editingMember ? "update" : "create"} a team member.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input placeholder="CEO & Founder" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="A short biography" 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/profile.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please use a square image for best results.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Social Links</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/in/username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://twitter.com/username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="github"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://github.com/username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingMember ? "Update" : "Create"} Team Member
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}