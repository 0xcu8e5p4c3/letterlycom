import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

type ContactSubmission = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

export default function ContactSubmissions() {
  const { toast } = useToast();
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ['/api/contact'],
    retry: false,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load contact submissions. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleViewDetails = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
  };

  const handleCloseDetails = () => {
    setSelectedSubmission(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contact Submissions</CardTitle>
          <CardDescription>Loading submissions...</CardDescription>
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
          <CardTitle>Contact Form Submissions</CardTitle>
          <CardDescription>
            View and manage contact form submissions from website visitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submissions && submissions.length > 0 ? (
            <Table>
              <TableCaption>List of all contact form submissions</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission: ContactSubmission) => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.id}</TableCell>
                    <TableCell>{submission.name}</TableCell>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell>{submission.subject}</TableCell>
                    <TableCell>{formatDate(submission.createdAt)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(submission)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-10">
              <p className="text-muted-foreground">
                No contact submissions yet. They will appear here when visitors submit the contact form.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSubmission && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Submission Details</CardTitle>
                <CardDescription>
                  From {selectedSubmission.name} on {formatDate(selectedSubmission.createdAt)}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleCloseDetails}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Contact Information</h4>
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {selectedSubmission.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {selectedSubmission.email}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Subject</h4>
                <p className="text-sm">{selectedSubmission.subject}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Message</h4>
                <p className="text-sm whitespace-pre-wrap">{selectedSubmission.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}