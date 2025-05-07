import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const joinFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  experience: z.string({
    required_error: "Please select your experience level",
  }),
  message: z.string().optional(),
  newsletter: z.boolean().default(false),
});

type JoinFormValues = z.infer<typeof joinFormSchema>;

export default function JoinForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<JoinFormValues>({
    resolver: zodResolver(joinFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
      newsletter: false,
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: JoinFormValues) => {
      // First try the API request
      return apiRequest("/api/members/register", { 
        method: "POST", 
        body: JSON.stringify(data) 
      })
      .catch(error => {
        console.log("API request failed, using local storage fallback", error);
        
        // Check if email already exists in local storage
        try {
          const existingMembers = JSON.parse(localStorage.getItem('members') || '[]');
          const emailExists = existingMembers.some((member: any) => 
            member.email === data.email
          );
          
          if (emailExists) {
            // Simulate a 409 Conflict response
            throw new Error("Email already exists");
          }
          
          // Add new member with timestamp and ID
          const newMember = {
            ...data,
            id: Date.now(),
            registeredAt: new Date().toISOString(),
            name: `${data.firstName} ${data.lastName}`
          };
          
          // Save updated members
          localStorage.setItem('members', JSON.stringify([...existingMembers, newMember]));
          
          return newMember; // Return the member for success handling
        } catch (storageError) {
          if (storageError.message === "Email already exists") {
            throw storageError; // Re-throw duplicate email error
          }
          console.error("Local storage fallback failed", storageError);
          throw error; // Re-throw original error if local storage fails
        }
      });
    },
    onSuccess: () => {
      toast({
        title: "Registration Complete",
        description: "Thank you for joining our chess society! We'll be in touch soon.",
      });
      form.reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      // Check if the error message contains information about duplicate email
      const errorMessage = error.message || "";
      if (errorMessage.includes("409") || errorMessage.includes("already exists") || errorMessage.includes("Email already")) {
        toast({
          title: "Email Already Registered",
          description: "This email address is already registered. Please use a different email or contact us if you need to update your information.",
          variant: "destructive",
        });
        // Focus the email field so user can easily change it
        const emailField = document.querySelector('input[name="email"]');
        if (emailField) {
          (emailField as HTMLInputElement).focus();
        }
      } else {
        toast({
          title: "Registration Failed",
          description: "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    },
  });

  function onSubmit(data: JoinFormValues) {
    setIsSubmitting(true);
    
    // Send the actual data to the server
    registerMutation.mutate(data);
    
    console.log("Submitting membership data:", data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-2xl font-bold font-display mb-6">Register Now</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="John" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Smith" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="john.smith@example.com" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chess Experience</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (&lt; 1000)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (1000-1600)</SelectItem>
                  <SelectItem value="advanced">Advanced (1600-2000)</SelectItem>
                  <SelectItem value="expert">Expert (2000+)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why do you want to join?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us a bit about yourself and why you're interested in joining our chess society..." 
                  className="min-h-[80px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="newsletter"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Subscribe to our newsletter</FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-primary text-white hover:bg-accent hover:text-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Complete Registration"}
        </Button>
      </form>
    </Form>
  );
}
